// config/database.js
const { Sequelize } = require("sequelize");
const path = require("path");

// Load local .env only for development
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

// Prefer DB_* but fall back to PG* (what pg reads natively)
const host = process.env.DB_HOST || process.env.PGHOST;
const port = Number(process.env.DB_PORT || process.env.PGPORT || 5432);
const database = process.env.DB_NAME || process.env.PGDATABASE || "postgres";
const user =
  process.env.DB_USER || process.env.DB_USERNAME || process.env.PGUSER;
const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;

// Validate required environment variables in production
if (process.env.NODE_ENV === "production") {
  const missing = [];
  if (!host) missing.push("DB_HOST");
  if (!user) missing.push("DB_USER");
  if (!password) missing.push("DB_PASSWORD");
  if (!database) missing.push("DB_NAME");

  if (missing.length > 0) {
    throw new Error(
      `Missing required database environment variables: ${missing.join(", ")}`,
    );
  }
}

// SSL configuration - only enable for production (RDS)
const dialectOptions =
  process.env.NODE_ENV === "production"
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {};

// Helpful one-line log (no secrets)
console.log(
  `[DB] Connecting to: ${host}:${port}, database: ${database}, user: ${user}`,
);
if (process.env.NODE_ENV === "production") {
  console.log("[DB] SSL enabled for RDS connection");
}

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "postgres",
  dialectOptions,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
    timeout: 30000,
  },
});

// Add connection test function
sequelize.testConnection = async function () {
  try {
    await this.authenticate();
    console.log("✅ Database connection established successfully.");
    return true;
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    return false;
  }
};

module.exports = sequelize;
