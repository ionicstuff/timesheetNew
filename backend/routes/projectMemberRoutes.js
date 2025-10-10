const express = require("express");
const router = express.Router({ mergeParams: true });
const { authMiddleware } = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const { ProjectMember, User } = require("../models");

router.use(authMiddleware);

// List members
router.get("/", async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const members = await ProjectMember.findAll({
      where: { projectId, isActive: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "designation",
          ],
        },
      ],
      order: [["created_at", "ASC"]],
    });
    res.json(
      members.map((m) => ({
        user: m.user,
        projectRole: m.projectRole,
        isActive: m.isActive,
        addedBy: m.addedBy,
        createdAt: m.created_at || m.createdAt,
      })),
    );
  } catch (e) {
    console.error("get members failed", e);
    res.status(500).json({ message: "Failed to fetch project members" });
  }
});

// Add member
router.post(
  "/",
  authorizeRoles("System Admin", "Account Manager", "Project Manager"),
  async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const { userId, projectRole } = req.body;
      if (!userId)
        return res.status(400).json({ message: "userId is required" });

      const [row, created] = await ProjectMember.findOrCreate({
        where: { projectId, userId },
        defaults: {
          projectId,
          userId,
          projectRole: projectRole || null,
          isActive: true,
          addedBy: req.user.id,
        },
      });

      if (!created) {
        await row.update({
          isActive: true,
          projectRole: projectRole || row.projectRole,
          addedBy: row.addedBy || req.user.id,
        });
      }

      res.status(created ? 201 : 200).json({ success: true });
    } catch (e) {
      console.error("add member failed", e);
      res.status(500).json({ message: "Failed to add member" });
    }
  },
);

// Update member
router.put(
  "/:userId",
  authorizeRoles("System Admin", "Account Manager", "Project Manager"),
  async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const userId = parseInt(req.params.userId, 10);
      const { projectRole, isActive } = req.body || {};

      const row = await ProjectMember.findOne({ where: { projectId, userId } });
      if (!row) return res.status(404).json({ message: "Member not found" });

      await row.update({
        projectRole:
          typeof projectRole !== "undefined" ? projectRole : row.projectRole,
        isActive: typeof isActive !== "undefined" ? !!isActive : row.isActive,
      });

      res.json({ success: true });
    } catch (e) {
      console.error("update member failed", e);
      res.status(500).json({ message: "Failed to update member" });
    }
  },
);

// Remove member
router.delete(
  "/:userId",
  authorizeRoles("System Admin", "Account Manager", "Project Manager"),
  async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const userId = parseInt(req.params.userId, 10);
      const row = await ProjectMember.findOne({ where: { projectId, userId } });
      if (!row) return res.status(404).json({ message: "Member not found" });
      await row.destroy();
      res.json({ success: true });
    } catch (e) {
      console.error("delete member failed", e);
      res.status(500).json({ message: "Failed to delete member" });
    }
  },
);

module.exports = router;
