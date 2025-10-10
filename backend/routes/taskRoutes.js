const express = require("express");
const taskController = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// Protect all task routes
router.use(authMiddleware);

// Task routes
router.get(
  "/",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.getTasks,
);
router.get("/my-tasks", taskController.getMyTasks);
router.get("/stats", taskController.getTaskStats);
router.post(
  "/",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
  ),
  taskController.createTask,
);
router.get(
  "/project/:projectId(\\d+)",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.getTasksByProject,
);
router.put(
  "/:id(\\d+)/accept",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.acceptTask,
);
router.put(
  "/:id(\\d+)/reject",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.rejectTask,
);
router.put(
  "/:id(\\d+)/assign",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
  ),
  taskController.assignTask,
);

// Timer action routes
router.post(
  "/:id(\\d+)/start",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.startTask,
);
router.post(
  "/:id(\\d+)/pause",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.pauseTask,
);
router.post(
  "/:id(\\d+)/resume",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.resumeTask,
);
router.post(
  "/:id(\\d+)/stop",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.stopTask,
);
router.post(
  "/:id(\\d+)/complete",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.completeTask,
);
router.get(
  "/:id(\\d+)/logs",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.getTaskTimeLogs,
);

// Comments
router.get("/:id(\\d+)/comments", taskController.getTaskComments);
router.post("/:id(\\d+)/comments", taskController.createTaskComment);
router.patch(
  "/:id(\\d+)/comments/:commentId(\\d+)",
  taskController.updateTaskComment,
);
router.delete(
  "/:id(\\d+)/comments/:commentId(\\d+)",
  taskController.deleteTaskComment,
);
router.post(
  "/:id(\\d+)/comments/:commentId(\\d+)/like",
  taskController.likeTaskComment,
);
router.delete(
  "/:id(\\d+)/comments/:commentId(\\d+)/like",
  taskController.unlikeTaskComment,
);

// Files
router.post("/:id(\\d+)/files", taskController.uploadTaskFiles);
router.get("/:id(\\d+)/files", taskController.getTaskFiles);
router.get(
  "/:id(\\d+)/files/:fileId(\\d+)/download",
  taskController.downloadTaskFile,
);
router.delete("/:id(\\d+)/files/:fileId(\\d+)", taskController.deleteTaskFile);

// Dependencies
router.get("/:id(\\d+)/dependencies", taskController.getTaskDependencies);
router.post("/:id(\\d+)/dependencies", taskController.addTaskDependency);
router.delete(
  "/:id(\\d+)/dependencies/:depId(\\d+)",
  taskController.removeTaskDependency,
);

// History & duplicate
router.get("/:id(\\d+)/history", taskController.getTaskHistory);
router.post(
  "/:id(\\d+)/duplicate",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
  ),
  taskController.duplicateTask,
);

router.get(
  "/:id(\\d+)",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
    "Developer",
  ),
  taskController.getTask,
);
router.put(
  "/:id(\\d+)",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
  ),
  taskController.updateTask,
);
router.delete(
  "/:id(\\d+)",
  authorizeRoles(
    "Admin",
    "Director",
    "Account Manager",
    "Project Manager",
    "Team Lead",
  ),
  taskController.deleteTask,
);

module.exports = router;
