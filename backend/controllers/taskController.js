const { Task, Project, User } = require('../models');
const sequelize = require('../config/database');
const notificationSvc = require('../services/notificationService');

async function isProjectMemberByTask(taskId, userId) {
  const [rows] = await sequelize.query(
    `SELECT 1 FROM tasks t
     JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = $1 AND pm.is_active = true
     WHERE t.id = $2 LIMIT 1`,
    { bind: [userId, taskId] },
  );
  return !!(rows && rows.length);
}

// File uploads for task attachments
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const taskUploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/tasks');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'task-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadTaskFilesMulter = multer({
  storage: taskUploadStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: function (req, file, cb) {
    const allowed = /pdf|doc|docx|zip|jpg|jpeg|png|txt|csv|xlsx|ppt|pptx/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Unsupported file type'));
  },
});

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { projectId, assignedTo, status } = req.query;
    const whereClause = {};

    if (projectId) whereClause.projectId = projectId;
    if (assignedTo) whereClause.assignedTo = assignedTo;
    if (status) whereClause.status = status;

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode'],
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get tasks by project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.findAll({
      where: { projectId },
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    res.status(500).json({
      message: 'Error fetching tasks by project',
      error: error.message,
    });
  }
};

// Get a single task
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'assignee' },
      ],
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
      projectId,
      name,
      description,
      assignedTo: requestedAssignedTo,
      estimatedTime,
      sprintStartDate,
      sprintEndDate,
      priority,
    } = req.body;

    // Determine final assignee (default to current user)
    let finalAssignedTo = requestedAssignedTo || req.user?.id || null;

    // If assigning to someone else, enforce permission
    if (finalAssignedTo && req.user?.id && finalAssignedTo !== req.user.id) {
      const targetUser = await User.findByPk(finalAssignedTo);
      if (!targetUser || !targetUser.isActive) {
        return res.status(400).json({ message: 'Target user is not active or does not exist' });
      }

      // 1) Hierarchy containment
      const [rows] = await sequelize.query(
        `
        WITH RECURSIVE team(user_id) AS (
          SELECT user_id FROM user_hierarchies WHERE parent_user_id = $1 AND is_active
          UNION
          SELECT uh.user_id FROM user_hierarchies uh JOIN team t ON uh.parent_user_id = t.user_id WHERE uh.is_active
        ) SELECT 1 FROM team WHERE user_id = $2 LIMIT 1
      `,
        { bind: [req.user.id, finalAssignedTo] },
      );

      let hasPermission = rows && rows.length > 0;

      // 2) PM or 3) Account Manager
      if (!hasPermission && projectId) {
        const project = await Project.findByPk(projectId);
        if (project && project.projectManagerId === req.user.id) hasPermission = true;
        if (!hasPermission && project && project.clientId) {
          const [clients] = await sequelize.query(
            'SELECT 1 FROM clients WHERE id = $1 AND account_manager_id = $2 LIMIT 1',
            { bind: [project.clientId, req.user.id] },
          );
          if (clients && clients.length > 0) hasPermission = true;
        }
      }

      if (!hasPermission) {
        return res.status(403).json({
          message: 'You are not authorized to assign this task to that user',
        });
      }
    }

    // Enforce project membership for assignee
    if (finalAssignedTo && projectId) {
      const [pm] = await sequelize.query(
        'SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2 AND is_active = true LIMIT 1',
        { bind: [projectId, finalAssignedTo] },
      );
      if (!pm || pm.length === 0) {
        return res.status(400).json({
          message:
            'Assignee must be a member of the project. Add them to the project before assigning tasks.',
        });
      }
    }

    const task = await Task.create({
      projectId,
      name,
      description,
      assignedTo: finalAssignedTo,
      estimatedTime,
      sprintStartDate,
      sprintEndDate,
      priority: priority || 'Medium',
      createdBy: req.user?.id || null,
    });

    if (task.assignedTo) {
      try {
        await notificationSvc.notifyTaskAssigned(task, req.user?.id || null);
      } catch (e) {
        console.error('notifyTaskAssigned failed', e);
      }
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      assignedTo,
      estimatedTime,
      status,
      sprintStartDate,
      sprintEndDate,
      priority,
    } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    // If changing assignee, ensure membership in project
    if (typeof assignedTo !== 'undefined' && assignedTo !== null) {
      const [pm] = await sequelize.query(
        'SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2 AND is_active = true LIMIT 1',
        { bind: [task.projectId, assignedTo] },
      );
      if (!pm || pm.length === 0) {
        return res.status(400).json({
          message:
            'Assignee must be a member of the project. Add them to the project before assigning tasks.',
        });
      }
    }

    const prevAssignee = task.assignedTo;
    const prevStatus = task.status;
    await task.update({
      name,
      description,
      assignedTo,
      estimatedTime,
      status,
      sprintStartDate,
      sprintEndDate,
      priority,
    });

    // Log activities
    try {
      if (typeof assignedTo !== 'undefined' && assignedTo !== prevAssignee) {
        const TaskActivity = require('../models/TaskActivity');
        await TaskActivity.create({
          taskId: task.id,
          actorId: req.user?.id || null,
          type: 'assigned',
          detailsJson: { from: prevAssignee, to: assignedTo },
        });
        await notificationSvc.notifyTaskReassigned(task, prevAssignee, req.user?.id || null);
      }
      if (typeof status !== 'undefined' && status !== prevStatus) {
        const TaskActivity = require('../models/TaskActivity');
        await TaskActivity.create({
          taskId: task.id,
          actorId: req.user?.id || null,
          type: 'status_changed',
          detailsJson: { from: prevStatus, to: status },
        });
        await notificationSvc.notifyTaskStatusChanged(task, prevStatus, req.user?.id || null);
      }
    } catch (e) {
      console.error('updateTask notifications/activities failed', e);
    }

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// Accept a task
const acceptTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the current user is the assigned user
    if (task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'You can only accept tasks assigned to you' });
    }

    await task.update({
      acceptanceStatus: 'accepted',
      acceptedAt: new Date(),
    });

    res.json({ message: 'Task accepted successfully', task });
  } catch (error) {
    console.error('Error accepting task:', error);
    res.status(500).json({ message: 'Error accepting task', error: error.message });
  }
};

// Reject a task
const rejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the current user is the assigned user
    if (task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'You can only reject tasks assigned to you' });
    }

    await task.update({
      acceptanceStatus: 'rejected',
      rejectionReason: rejectionReason || null,
    });

    res.json({ message: 'Task rejected successfully', task });
  } catch (error) {
    console.error('Error rejecting task:', error);
    res.status(500).json({ message: 'Error rejecting task', error: error.message });
  }
};

// Get tasks assigned to current user
const getMyTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User information not available.' });
    }

    const {
      status,
      acceptanceStatus,
      upcomingWithinDays,
      limit: limitParam,
      projectId,
      searchTerm,
      priority,
    } = req.query;
    const { Op } = require('sequelize');

    const whereClause = { assignedTo: req.user.id };

    if (status) whereClause.status = status;
    if (acceptanceStatus) whereClause.acceptanceStatus = acceptanceStatus;
    if (projectId) whereClause.projectId = projectId;
    if (priority) whereClause.priority = priority;

    if (upcomingWithinDays) {
      const days = parseInt(upcomingWithinDays, 10);
      if (!Number.isNaN(days) && days > 0) {
        const end = new Date();
        end.setDate(end.getDate() + days);
        whereClause.sprintEndDate = { [Op.lte]: end };
      }
    }

    const searchOr = [];
    if (searchTerm && String(searchTerm).trim()) {
      const t = `%${searchTerm}%`;
      searchOr.push({ name: { [Op.iLike]: t } });
      const SequelizeLib = require('sequelize');
      searchOr.push(
        SequelizeLib.where(SequelizeLib.col('project.project_name'), {
          [Op.iLike]: t,
        }),
      );
    }

    let finalWhere = whereClause;
    if (searchOr.length > 0) {
      finalWhere = { [Op.and]: [whereClause, { [Op.or]: searchOr }] };
    }

    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 25, 200) : 100;

    const tasks = await Task.findAll({
      where: finalWhere,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode'],
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching my tasks:', error);
    res.status(500).json({ message: 'Error fetching my tasks', error: error.message });
  }
};

// Get time logs for a task
const getTaskTimeLogs = async (req, res) => {
  try {
    const TaskTimeLog = require('../models/TaskTimeLog');
    const { id } = req.params;
    const logs = await TaskTimeLog.findAll({
      where: { taskId: id },
      order: [['created_at', 'ASC']],
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching task time logs:', error);
    res.status(500).json({ message: 'Error fetching task time logs', error: error.message });
  }
};

// Assign a task to a user (single)
const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo, confirmOverwrite } = req.body;
    const task = await Task.findByPk(id, {
      include: [{ model: Project, as: 'project' }],
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const targetUser = await User.findByPk(assignedTo);
    if (!targetUser || !targetUser.is_active)
      return res.status(400).json({ message: 'Target user is not active or does not exist' });

    // Permission checks: requester must manage targetUser via user_hierarchies or be project manager or account manager
    const sequelize = require('../config/database');
    // Check user_hierarchies - direct or recursive
    const [rows] = await sequelize.query(
      `
      WITH RECURSIVE team(user_id) AS (
        SELECT user_id FROM user_hierarchies WHERE parent_user_id = $1 AND is_active
        UNION
        SELECT uh.user_id FROM user_hierarchies uh JOIN team t ON uh.parent_user_id = t.user_id WHERE uh.is_active
      ) SELECT 1 FROM team WHERE user_id = $2 LIMIT 1
    `,
      { bind: [req.user.id, assignedTo] },
    );

    let hasPermission = rows && rows.length > 0;

    // Check if requester is project manager
    if (!hasPermission && task.project && task.project.projectManagerId === req.user.id)
      hasPermission = true;

    // Check if requester is account manager for the project client
    if (!hasPermission && task.project && task.project.clientId) {
      const [clients] = await sequelize.query(
        'SELECT 1 FROM clients WHERE id = $1 AND account_manager_id = $2 LIMIT 1',
        { bind: [task.project.clientId, req.user.id] },
      );
      if (clients && clients.length > 0) hasPermission = true;
    }

    if (!hasPermission)
      return res.status(403).json({
        message: 'You are not authorized to assign this task to that user',
      });

    // Overwrite check
    if (task.assignedTo && task.assignedTo !== assignedTo && !confirmOverwrite) {
      return res.status(409).json({
        message: 'Task already assigned. Set confirmOverwrite=true to force overwrite',
        currentAssignee: task.assignedTo,
      });
    }

    // Membership check: user must be a member of the task's project
    const [pm] = await sequelize.query(
      'SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2 AND is_active = true LIMIT 1',
      { bind: [task.projectId, assignedTo] },
    );
    if (!pm || pm.length === 0) {
      return res.status(400).json({
        message:
          'Assignee must be a member of the project. Add them to the project before assigning tasks.',
      });
    }

    const prevAssignee = task.assignedTo;
    await task.update({ assignedTo });

    // Activity + Notifications for reassignment/assignment
    try {
      const TaskActivity = require('../models/TaskActivity');
      await TaskActivity.create({
        taskId: task.id,
        actorId: req.user?.id || null,
        type: 'assigned',
        detailsJson: { from: prevAssignee, to: assignedTo },
      });
      await notificationSvc.notifyTaskReassigned(task, prevAssignee, req.user?.id || null);
    } catch (e) {
      console.error('notifyTaskReassigned failed', e);
    }

    // Send email notification (emailService will fallback to console in dev)
    const emailService = require('../services/emailService');
    try {
      const assignee = await User.findByPk(assignedTo);
      await emailService.sendTaskStatusEmail(task, 'assigned', req.user);
      // Also send direct email to assignee if they have email
      if (assignee?.email) {
        await emailService.transporter.sendMail({
          from: `"TimeSheet Pro" <${process.env.EMAIL_FROM || 'noreply@timesheet.com'}>`,
          to: assignee.email,
          subject: `You have been assigned a task: ${task.name}`,
          html: `<p>Hi ${assignee.firstName || ''},</p><p>You have been assigned the task <strong>${task.name}</strong> in project ${task.project?.projectName || task.projectId}.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tasks/${task.id}">View Task</a></p>`,
        });
      }
    } catch (e) {
      console.error('Failed to send assignment email', e);
    }

    res.json({ message: 'Task assigned successfully', task });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Error assigning task', error: error.message });
  }
};

const TaskTimerService = require('../services/TaskTimerService');

const startTask = async (req, res) => {
  try {
    const task = await TaskTimerService.start(req.params.id, req.user, req.body?.note || null);
    res.json({ message: 'Task started', task });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const pauseTask = async (req, res) => {
  try {
    const task = await TaskTimerService.pause(req.params.id, req.user, req.body?.note || null);
    res.json({ message: 'Task paused', task });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const resumeTask = async (req, res) => {
  try {
    const task = await TaskTimerService.resume(req.params.id, req.user, req.body?.note || null);
    res.json({ message: 'Task resumed', task });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const stopTask = async (req, res) => {
  try {
    const task = await TaskTimerService.stop(req.params.id, req.user, req.body?.note || null);
    res.json({ message: 'Task stopped', task });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await TaskTimerService.complete(req.params.id, req.user, req.body?.note || null);
    res.json({ message: 'Task completed and timesheet prefilled', task });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// Stats endpoint
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query;
    const { Op } = require('sequelize');

    const baseWhere = projectId ? { projectId } : {};
    const isPending = {
      status: { [Op.in]: ['pending', 'in_progress', 'paused'] },
      acceptanceStatus: { [Op.ne]: 'rejected' },
    };
    const isOverdue = {
      sprintEndDate: { [Op.lt]: new Date() },
      status: { [Op.notIn]: ['completed', 'cancelled'] },
    };

    // Assigned to me
    const assignedWhere = { ...baseWhere, assignedTo: userId };
    const assignedTotal = await Task.count({ where: assignedWhere });
    const assignedPending = await Task.count({
      where: { ...assignedWhere, ...isPending },
    });
    const assignedOverdue = await Task.count({
      where: { ...assignedWhere, ...isOverdue },
    });

    // Created by me
    const createdWhere = { ...baseWhere, createdBy: userId };
    const createdTotal = await Task.count({ where: createdWhere });
    const createdPending = await Task.count({
      where: { ...createdWhere, ...isPending },
    });
    const createdOverdue = await Task.count({
      where: { ...createdWhere, ...isOverdue },
    });

    res.json({
      assigned: {
        total: assignedTotal,
        pending: assignedPending,
        overdue: assignedOverdue,
      },
      created: {
        total: createdTotal,
        pending: createdPending,
        overdue: createdOverdue,
      },
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Error fetching task stats', error: error.message });
  }
};

// ----- Comments -----
const { TaskComment, TaskFile, TaskDependency } = require('../models');

const getTaskComments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can view comments' });
    }
    const { User } = require('../models');
    const comments = await TaskComment.findAll({
      where: { taskId: id, isDeleted: false },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['created_at', 'ASC']],
    });
    // Attach likes count and whether current user liked
    const ids = comments.map((c) => c.id);
    let counts = {},
      mine = new Set();
    if (ids.length) {
      const [cntRows] = await sequelize.query(
        'SELECT comment_id, COUNT(*)::int as cnt FROM task_comment_likes WHERE comment_id = ANY($1) GROUP BY comment_id',
        { bind: [ids] },
      );
      cntRows.forEach((r) => {
        counts[r.comment_id] = r.cnt;
      });
      const [mineRows] = await sequelize.query(
        'SELECT comment_id FROM task_comment_likes WHERE user_id = $1 AND comment_id = ANY($2)',
        { bind: [req.user.id, ids] },
      );
      mineRows.forEach((r) => mine.add(r.comment_id));
    }
    const enriched = comments.map((c) => ({
      ...c.toJSON(),
      likes: counts[c.id] || 0,
      liked: mine.has(c.id),
    }));
    res.json(enriched);
  } catch (e) {
    console.error('getTaskComments error', e);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

const createTaskComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can comment' });
    }
    const { content, parentCommentId } = req.body || {};
    if (!content || !String(content).trim())
      return res.status(400).json({ message: 'content is required' });
    const row = await TaskComment.create({
      taskId: id,
      userId: req.user.id,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    });
    res.status(201).json(row);
  } catch (e) {
    console.error('createTaskComment error', e);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

const updateTaskComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can update comments' });
    }
    const { content } = req.body || {};
    const row = await TaskComment.findOne({
      where: { id: commentId, taskId: id },
    });
    if (!row) return res.status(404).json({ message: 'Comment not found' });
    const role = req.user?.roleMaster?.roleName || '';
    const privileged = ['Admin', 'Director', 'Project Manager', 'Account Manager'].map((s) =>
      s.toLowerCase(),
    );
    const canEdit = row.userId === req.user.id || privileged.includes(role.toLowerCase());
    if (!canEdit) return res.status(403).json({ message: 'Not allowed' });
    await row.update({ content: String(content || '').trim() });
    res.json(row);
  } catch (e) {
    console.error('updateTaskComment error', e);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

const deleteTaskComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can delete comments' });
    }
    const row = await TaskComment.findOne({
      where: { id: commentId, taskId: id },
    });
    if (!row) return res.status(404).json({ message: 'Comment not found' });
    const role = req.user?.roleMaster?.roleName || '';
    const privileged = ['Admin', 'Director', 'Project Manager', 'Account Manager'].map((s) =>
      s.toLowerCase(),
    );
    const canDelete = row.userId === req.user.id || privileged.includes(role.toLowerCase());
    if (!canDelete) return res.status(403).json({ message: 'Not allowed' });
    await row.update({ isDeleted: true });
    res.json({ success: true });
  } catch (e) {
    console.error('deleteTaskComment error', e);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

// ----- Files -----
const uploadTaskFiles = async (req, res) => {
  uploadTaskFilesMulter.any()(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const { id } = req.params;
      if (!(await isProjectMemberByTask(id, req.user.id))) {
        return res.status(403).json({ message: 'Only project members can upload files' });
      }
      const files = req.files || [];
      if (!files.length) return res.status(400).json({ message: 'No files uploaded' });
      const saved = await Promise.all(
        files.map(async (f) => {
          const savedRow = await TaskFile.create({
            taskId: id,
            uploadedBy: req.user.id,
            originalName: f.originalname,
            filename: f.filename,
            mimeType: f.mimetype,
            size: f.size,
            path: path.join('uploads/tasks', f.filename),
          });
          return savedRow;
        }),
      );
      res.status(201).json({ attachments: saved });
    } catch (e) {
      console.error('uploadTaskFiles error', e);
      res.status(500).json({ message: 'Failed to upload files' });
    }
  });
};

const getTaskFiles = async (req, res) => {
  try {
    const { id } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can view files' });
    }
    const files = await TaskFile.findAll({
      where: { taskId: id },
      order: [['created_at', 'DESC']],
    });
    res.json(files);
  } catch (e) {
    console.error('getTaskFiles error', e);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
};

const downloadTaskFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can download files' });
    }
    const row = await TaskFile.findOne({ where: { id: fileId, taskId: id } });
    if (!row) return res.status(404).json({ message: 'File not found' });
    const absPath = path.join(__dirname, '..', row.path);
    res.download(absPath, row.originalName);
  } catch (e) {
    console.error('downloadTaskFile error', e);
    res.status(500).json({ message: 'Failed to download file' });
  }
};

const deleteTaskFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can delete files' });
    }
    const row = await TaskFile.findOne({ where: { id: fileId, taskId: id } });
    if (!row) return res.status(404).json({ message: 'File not found' });
    const role = req.user?.roleMaster?.roleName || '';
    const privileged = ['Admin', 'Director', 'Project Manager', 'Account Manager'].map((s) =>
      s.toLowerCase(),
    );
    const canDelete = row.uploadedBy === req.user.id || privileged.includes(role.toLowerCase());
    if (!canDelete) return res.status(403).json({ message: 'Not allowed' });
    await row.destroy();
    // best-effort remove file from disk
    try {
      fs.unlinkSync(path.join(__dirname, '..', row.path));
    } catch {
      void 0;
    }
    res.json({ success: true });
  } catch (e) {
    console.error('deleteTaskFile error', e);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};

// ----- Dependencies -----
const getTaskDependencies = async (req, res) => {
  try {
    const { id } = req.params;
    const deps = await TaskDependency.findAll({
      where: { taskId: id },
      include: [{ model: Task, as: 'dependsOn', attributes: ['id', 'name'] }],
      order: [['created_at', 'ASC']],
    });
    res.json(deps);
  } catch (e) {
    console.error('getTaskDependencies error', e);
    res.status(500).json({ message: 'Failed to fetch dependencies' });
  }
};

const addTaskDependency = async (req, res) => {
  try {
    const { id } = req.params;
    const { dependsOnTaskId } = req.body || {};
    if (!dependsOnTaskId) return res.status(400).json({ message: 'dependsOnTaskId is required' });
    if (String(dependsOnTaskId) === String(id))
      return res.status(400).json({ message: 'Task cannot depend on itself' });
    const base = await Task.findByPk(id);
    const dep = await Task.findByPk(dependsOnTaskId);
    if (!base || !dep) return res.status(404).json({ message: 'Task not found' });
    if (base.projectId !== dep.projectId)
      return res.status(400).json({ message: 'Tasks must be in the same project' });
    const [row, created] = await TaskDependency.findOrCreate({
      where: { taskId: id, dependsOnTaskId },
      defaults: { taskId: id, dependsOnTaskId },
    });
    res.status(created ? 201 : 200).json(row);
  } catch (e) {
    console.error('addTaskDependency error', e);
    res.status(500).json({ message: 'Failed to add dependency' });
  }
};

const removeTaskDependency = async (req, res) => {
  try {
    const { id, depId } = req.params;
    const row = await TaskDependency.findOne({
      where: { id: depId, taskId: id },
    });
    if (!row) return res.status(404).json({ message: 'Dependency not found' });
    await row.destroy();
    res.json({ success: true });
  } catch (e) {
    console.error('removeTaskDependency error', e);
    res.status(500).json({ message: 'Failed to remove dependency' });
  }
};

// ----- History (aggregate simple) -----
const getTaskHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const TaskTimeLog = require('../models/TaskTimeLog');
    const TaskActivity = require('../models/TaskActivity');
    const [logs, comments, files, activities] = await Promise.all([
      TaskTimeLog.findAll({
        where: { taskId: id },
        order: [['created_at', 'ASC']],
      }),
      TaskComment.findAll({
        where: { taskId: id, isDeleted: false },
        order: [['created_at', 'ASC']],
      }),
      TaskFile.findAll({
        where: { taskId: id },
        order: [['created_at', 'ASC']],
      }),
      TaskActivity.findAll({
        where: { taskId: id },
        order: [['created_at', 'ASC']],
      }),
    ]);

    const timeline = [];
    logs.forEach((l) =>
      timeline.push({
        type: 'time_log',
        createdAt: l.created_at || l.createdAt,
        payload: l,
      }),
    );
    comments.forEach((c) =>
      timeline.push({
        type: 'comment',
        createdAt: c.created_at || c.createdAt,
        payload: c,
      }),
    );
    files.forEach((f) =>
      timeline.push({
        type: 'file_uploaded',
        createdAt: f.created_at || f.createdAt,
        payload: f,
      }),
    );
    activities.forEach((a) =>
      timeline.push({
        type: a.type,
        createdAt: a.created_at || a.createdAt,
        payload: a.detailsJson || {},
      }),
    );

    timeline.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.json(timeline);
  } catch (e) {
    console.error('getTaskHistory error', e);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// ----- Likes -----
const TaskCommentLike = require('../models/TaskCommentLike');

const likeTaskComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can like comments' });
    }
    await TaskCommentLike.findOrCreate({
      where: { commentId, userId: req.user.id },
      defaults: { commentId, userId: req.user.id },
    });
    const [[{ cnt }]] = await sequelize.query(
      'SELECT COUNT(*)::int as cnt FROM task_comment_likes WHERE comment_id=$1',
      { bind: [commentId] },
    );
    res.json({ liked: true, likes: Number(cnt) });
  } catch (e) {
    console.error('likeTaskComment error', e);
    res.status(500).json({ message: 'Failed to like comment' });
  }
};

const unlikeTaskComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    if (!(await isProjectMemberByTask(id, req.user.id))) {
      return res.status(403).json({ message: 'Only project members can unlike comments' });
    }
    await TaskCommentLike.destroy({
      where: { commentId, userId: req.user.id },
    });
    const [[{ cnt }]] = await sequelize.query(
      'SELECT COUNT(*)::int as cnt FROM task_comment_likes WHERE comment_id=$1',
      { bind: [commentId] },
    );
    res.json({ liked: false, likes: Number(cnt) });
  } catch (e) {
    console.error('unlikeTaskComment error', e);
    res.status(500).json({ message: 'Failed to unlike comment' });
  }
};

// ----- Duplicate -----
// ----- Duplicate -----
const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const source = await Task.findByPk(id);
    if (!source) return res.status(404).json({ message: 'Task not found' });
    const clone = await Task.create({
      projectId: source.projectId,
      name: `${source.name} (Copy)`,
      description: source.description,
      assignedTo: null,
      estimatedTime: source.estimatedTime,
      status: 'pending',
      acceptanceStatus: 'pending',
      priority: source.priority || 'Medium',
      createdBy: req.user?.id || null,
      sprintStartDate: source.sprintStartDate,
      sprintEndDate: source.sprintEndDate,
    });
    res.status(201).json({ message: 'Task duplicated', task: clone });
  } catch (e) {
    console.error('duplicateTask error', e);
    res.status(500).json({ message: 'Failed to duplicate task' });
  }
};

module.exports = {
  getTasks,
  getTasksByProject,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  acceptTask,
  rejectTask,
  getMyTasks,
  assignTask,
  startTask,
  pauseTask,
  resumeTask,
  stopTask,
  completeTask,
  getTaskTimeLogs,
  getTaskStats,
  // new
  getTaskComments,
  createTaskComment,
  updateTaskComment,
  deleteTaskComment,
  uploadTaskFiles,
  getTaskFiles,
  downloadTaskFile,
  deleteTaskFile,
  getTaskDependencies,
  addTaskDependency,
  removeTaskDependency,
  getTaskHistory,
  duplicateTask,
  likeTaskComment,
  unlikeTaskComment,
};
