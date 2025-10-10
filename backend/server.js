const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Load dotenv only in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const timesheetEntryRoutes = require("./routes/timesheetEntryRoutes");
const sequelize = require("./config/database");

const app = express();

// Security middleware
app.use(
  helmet({
    // Customize helmet for your needs
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000,
  message: "Too many requests from this IP, please try again later.",
  skip: (req) => req.path.startsWith("/api/admin"),
});
app.use("/api", limiter);

// CORS configuration
const getCorsOrigins = () => {
  if (process.env.NODE_ENV === "production") {
    const productionOrigins = (
      process.env.CORS_ORIGIN ||
      process.env.CORS_ORIGINS ||
      ""
    )
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    // Default production origins if none specified
    return productionOrigins.length > 0
      ? productionOrigins
      : [
          "https://your-domain.com", // Replace with your actual domain
        ];
  }

  // Development origins
  return [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ];
};

app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  }),
);

app.options("*", cors());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware - use combined for production, dev for development
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Enhanced health check endpoint
app.get("/api/health", async (req, res) => {
  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: "Checking...",
  };

  try {
    // Test database connection
    await sequelize.authenticate();
    healthCheck.database = "Connected";

    res.json(healthCheck);
  } catch (error) {
    healthCheck.status = "Degraded";
    healthCheck.database = "Disconnected";
    healthCheck.error = error.message;

    res.status(503).json(healthCheck);
  }
});

// Deep health check (for load balancers)
app.get("/api/health/deep", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.json({
      status: "OK",
      database: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      database: "Disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Timesheet API Server",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    status: "running",
  });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/timesheet", require("./routes/timesheet"));
app.use("/api/timesheet-entries", timesheetEntryRoutes);
app.use("/api/clients", require("./routes/clients"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/client-management", require("./routes/clientRoutes"));
app.use("/api/spocs", require("./routes/spocRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./admin/routes/admin"));
app.use("/api/finance", require("./routes/financeRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);

  // Database connection errors
  if (err.name === "SequelizeConnectionError") {
    return res.status(503).json({
      message: "Database connection unavailable",
      error: process.env.NODE_ENV === "development" ? err.message : {},
    });
  }

  res.status(err.status || 500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 3000;

// Database connection with retry logic
async function connectToDatabase(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(
        `Attempting database connection (attempt ${i + 1}/${retries})...`,
      );
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");
      return true;
    } catch (error) {
      console.error(
        `❌ Database connection failed (attempt ${i + 1}/${retries}):`,
        error.message,
      );

      if (i < retries - 1) {
        console.log(`Waiting ${delay / 1000} seconds before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        // Increase delay for next retry (exponential backoff)
        delay *= 1.5;
      }
    }
  }
  throw new Error(`Failed to connect to database after ${retries} attempts`);
}

// Graceful shutdown handler
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully...`);

  try {
    // Close database connection
    await sequelize.close();
    console.log("✅ Database connection closed.");

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
}

// Server startup
async function startServer() {
  try {
    // Connect to database with retry logic
    await connectToDatabase();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(
        `🔗 Deep health check: http://localhost:${PORT}/api/health/deep`,
      );
    });

    // Graceful shutdown handlers
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
