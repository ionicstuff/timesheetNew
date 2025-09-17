const { Task, Project, User } = require('../models');
const sequelize = require('../config/database');
const notificationSvc = require('../services/notificationService');

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
          attributes: ['id', 'projectName', 'projectCode']
        }, 
        { 
          model: User, 
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
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
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    res.status(500).json({ message: 'Error fetching tasks by project', error: error.message });
  }
};

// Get a single task
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id, {
      include: [{ model: Project, as: 'project' }, { model: User, as: 'assignee' }]
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
    const { projectId, name, description, assignedTo, estimatedTime, sprintStartDate, sprintEndDate } = req.body;
    const task = await Task.create({
      projectId,
      name,
      description,
      assignedTo,
      estimatedTime,
      sprintStartDate,
      sprintEndDate,
      createdBy: req.user?.id || null
    });

    // Notify assignee (if any)
    if (assignedTo) {
      try { await notificationSvc.notifyTaskAssigned(task, req.user?.id || null); } catch (e) { console.error('notifyTaskAssigned failed', e); }
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
    const { name, description, assignedTo, estimatedTime, status, sprintStartDate, sprintEndDate } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const prevAssignee = task.assignedTo;
    const prevStatus = task.status;
    await task.update({ name, description, assignedTo, estimatedTime, status, sprintStartDate, sprintEndDate });

    // Notifications: reassignment and status change
    try {
      if (typeof assignedTo !== 'undefined' && assignedTo !== prevAssignee) {
        await notificationSvc.notifyTaskReassigned(task, prevAssignee, req.user?.id || null);
      }
      if (typeof status !== 'undefined' && status !== prevStatus) {
        await notificationSvc.notifyTaskStatusChanged(task, prevStatus, req.user?.id || null);
      }
    } catch (e) { console.error('updateTask notifications failed', e); }

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
      acceptedAt: new Date()
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
      rejectionReason: rejectionReason || null
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
      console.error('req.user or req.user.id is missing in getMyTasks:', req.user);
      return res.status(401).json({ message: 'Unauthorized: User information not available.' });
    }
    console.log('req.user in getMyTasks:', req.user); // Debugging line

    const { status, acceptanceStatus, upcomingWithinDays, limit: limitParam, projectId } = req.query;
    const whereClause = { assignedTo: req.user.id };

    if (status) whereClause.status = status;
    if (acceptanceStatus) whereClause.acceptanceStatus = acceptanceStatus;
    if (projectId) whereClause.projectId = projectId;

    // Upcoming filter: tasks due within next N days, exclude completed/cancelled and rejected
    let order = [['created_at', 'DESC']];
    let limit;
    if (upcomingWithinDays) {
      const { Op } = require('sequelize');
      const n = Math.max(1, parseInt(upcomingWithinDays, 10) || 0);
      const start = new Date();
      start.setHours(0, 0, 0, 0); // include tasks due earlier today
      const end = new Date(start);
      end.setDate(start.getDate() + n);
      end.setHours(23, 59, 59, 999);

      whereClause.sprintEndDate = { [Op.gte]: start, [Op.lte]: end };
      // Exclude completed/cancelled and explicitly rejected
      whereClause.status = whereClause.status || { [Op.notIn]: ['completed', 'cancelled'] };
      if (!acceptanceStatus) {
        whereClause.acceptanceStatus = { [Op.ne]: 'rejected' };
      }
      order = [['sprintEndDate', 'ASC'], ['created_at', 'DESC']];
    }

    if (limitParam) {
      const l = parseInt(limitParam, 10);
      if (!Number.isNaN(l) && l > 0) limit = l;
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode']
        }
      ],
      order,
      ...(limit ? { limit } : {})
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
      order: [['created_at', 'ASC']]
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
    const task = await Task.findByPk(id, { include: [{ model: Project, as: 'project' }] });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const targetUser = await User.findByPk(assignedTo);
    if (!targetUser || !targetUser.is_active) return res.status(400).json({ message: 'Target user is not active or does not exist' });

    // Permission checks: requester must manage targetUser via user_hierarchies or be project manager or account manager
    const sequelize = require('../config/database');
    // Check user_hierarchies - direct or recursive
    const [rows] = await sequelize.query(`
      WITH RECURSIVE team(user_id) AS (
        SELECT user_id FROM user_hierarchies WHERE parent_user_id = $1 AND is_active
        UNION
        SELECT uh.user_id FROM user_hierarchies uh JOIN team t ON uh.parent_user_id = t.user_id WHERE uh.is_active
      ) SELECT 1 FROM team WHERE user_id = $2 LIMIT 1
    `, { bind: [req.user.id, assignedTo] });

    let hasPermission = rows && rows.length > 0;

    // Check if requester is project manager
    if (!hasPermission && task.project && task.project.projectManagerId === req.user.id) hasPermission = true;

    // Check if requester is account manager for the project client
    if (!hasPermission && task.project && task.project.clientId) {
      const [clients] = await sequelize.query('SELECT 1 FROM clients WHERE id = $1 AND account_manager_id = $2 LIMIT 1', { bind: [task.project.clientId, req.user.id] });
      if (clients && clients.length > 0) hasPermission = true;
    }

    if (!hasPermission) return res.status(403).json({ message: 'You are not authorized to assign this task to that user' });

    // Overwrite check
    if (task.assignedTo && task.assignedTo !== assignedTo && !confirmOverwrite) {
      return res.status(409).json({ message: 'Task already assigned. Set confirmOverwrite=true to force overwrite', currentAssignee: task.assignedTo });
    }

    const prevAssignee = task.assignedTo;
    await task.update({ assignedTo });

    // Notifications for reassignment/assignment
    try { await notificationSvc.notifyTaskReassigned(task, prevAssignee, req.user?.id || null); } catch (e) { console.error('notifyTaskReassigned failed', e); }

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
          html: `<p>Hi ${assignee.firstName || ''},</p><p>You have been assigned the task <strong>${task.name}</strong> in project ${task.project?.projectName || task.projectId}.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tasks/${task.id}">View Task</a></p>`
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
    const isPending = { status: { [Op.in]: ['pending','in_progress','paused'] }, acceptanceStatus: { [Op.ne]: 'rejected' } };
    const isOverdue = {
      sprintEndDate: { [Op.lt]: new Date() },
      status: { [Op.notIn]: ['completed','cancelled'] }
    };

    // Assigned to me
    const assignedWhere = { ...baseWhere, assignedTo: userId };
    const assignedTotal = await Task.count({ where: assignedWhere });
    const assignedPending = await Task.count({ where: { ...assignedWhere, ...isPending } });
    const assignedOverdue = await Task.count({ where: { ...assignedWhere, ...isOverdue } });

    // Created by me
    const createdWhere = { ...baseWhere, createdBy: userId };
    const createdTotal = await Task.count({ where: createdWhere });
    const createdPending = await Task.count({ where: { ...createdWhere, ...isPending } });
    const createdOverdue = await Task.count({ where: { ...createdWhere, ...isOverdue } });

    res.json({
      assigned: { total: assignedTotal, pending: assignedPending, overdue: assignedOverdue },
      created:  { total: createdTotal,  pending: createdPending,  overdue: createdOverdue }
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Error fetching task stats', error: error.message });
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
  getTaskStats
};

