const Notification = require('../models/Notification');
const sequelize = require('../config/database');
const emailService = require('../services/emailService');
const { createNotification, NotificationTypes } = require('../services/notificationService');

// GET /api/notifications
// Query: limit, offset, unreadOnly
exports.list = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const offset = parseInt(req.query.offset, 10) || 0;
    const unreadOnly = req.query.unreadOnly === '1' || req.query.unreadOnly === 'true';

    const where = { userId: req.user.id };
    if (unreadOnly) where.isRead = false;

    const items = await Notification.findAll({
      where,
      order: [['id', 'DESC']],
      limit,
      offset,
    });

    // Include createdAt derived from created_at if present
    const data = items.map((n) => {
      const obj = n.toJSON();
      const createdAt = typeof n.get === 'function' ? n.get('created_at') : obj.created_at;
      if (createdAt && !obj.createdAt) obj.createdAt = createdAt;
      return obj;
    });

    res.json({ items: data });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// GET /api/notifications/unread-count
exports.unreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

// POST /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id);
    if (!notif || notif.userId !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    if (!notif.isRead) await notif.update({ isRead: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      message: 'Error marking notification as read',
      error: error.message,
    });
  }
};

// POST /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    const [updated] = await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } },
    );
    res.json({ success: true, updated });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      message: 'Error marking all notifications as read',
      error: error.message,
    });
  }
};

// POST /api/notifications/run-deadline-reminders
// Restricted to managers/admins; scans tasks and issues due-soon/overdue notifications and emails
exports.runDeadlineReminders = async (req, res) => {
  try {
    // Due soon within next 24 hours
    const [dueSoon] = await sequelize.query(
      `
      SELECT t.id AS task_id, t.name AS task_name, t.project_id, t.assigned_to AS user_id, t.sprint_end_date AS due_at,
             u.email, u.first_name, u.last_name
      FROM tasks t
      JOIN users u ON u.id = t.assigned_to
      WHERE t.sprint_end_date IS NOT NULL
        AND t.status NOT IN ('completed','cancelled')
        AND t.assigned_to IS NOT NULL
        AND t.sprint_end_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
    `,
      { bind: [] },
    );

    // Overdue (past due) in last 7 days
    const [overdue] = await sequelize.query(
      `
      SELECT t.id AS task_id, t.name AS task_name, t.project_id, t.assigned_to AS user_id, t.sprint_end_date AS due_at,
             u.email, u.first_name, u.last_name
      FROM tasks t
      JOIN users u ON u.id = t.assigned_to
      WHERE t.sprint_end_date IS NOT NULL
        AND t.status NOT IN ('completed','cancelled')
        AND t.assigned_to IS NOT NULL
        AND t.sprint_end_date < NOW()
        AND t.sprint_end_date > NOW() - INTERVAL '7 days'
    `,
      { bind: [] },
    );

    // Helper to avoid duplicate notifications in last 12 hours
    async function shouldNotify(userId, type, taskId) {
      const [rows] = await sequelize.query(
        `SELECT 1 FROM notifications
         WHERE user_id = $1 AND type = $2 AND metadata->>'taskId' = $3
           AND created_at > NOW() - INTERVAL '12 hours'
         LIMIT 1`,
        { bind: [userId, type, String(taskId)] },
      );
      return !(rows && rows.length);
    }

    let created = 0;

    // Process due soon
    for (const r of dueSoon || []) {
      if (await shouldNotify(r.user_id, NotificationTypes.TASK_DUE_SOON, r.task_id)) {
        await createNotification({
          userId: r.user_id,
          type: NotificationTypes.TASK_DUE_SOON,
          ctx: { taskId: r.task_id, taskName: r.task_name, dueAt: r.due_at, projectId: r.project_id },
        });
        created++;
        // Email reminder
        if (r.email) {
          try {
            await emailService.transporter.sendMail({
              from: `"TimeSheet Pro" <${process.env.EMAIL_FROM || 'noreply@timesheet.com'}>`,
              to: r.email,
              subject: `Reminder: Task due soon - ${r.task_name}`,
              html: `<p>Hi ${r.first_name || ''},</p><p>Your task <strong>${r.task_name}</strong> is due by <strong>${new Date(r.due_at).toLocaleString()}</strong>.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tasks/${r.task_id}">View Task</a></p>`,
            });
          } catch (e) {
            // best-effort email, ignore failures
          }
        }
      }
    }

    // Process overdue
    for (const r of overdue || []) {
      if (await shouldNotify(r.user_id, NotificationTypes.TASK_OVERDUE, r.task_id)) {
        await createNotification({
          userId: r.user_id,
          type: NotificationTypes.TASK_OVERDUE,
          ctx: { taskId: r.task_id, taskName: r.task_name, dueAt: r.due_at, projectId: r.project_id },
        });
        created++;
        if (r.email) {
          try {
            await emailService.transporter.sendMail({
              from: `"TimeSheet Pro" <${process.env.EMAIL_FROM || 'noreply@timesheet.com'}>`,
              to: r.email,
              subject: `Overdue: ${r.task_name}`,
              html: `<p>Hi ${r.first_name || ''},</p><p>Your task <strong>${r.task_name}</strong> is overdue${r.due_at ? ` (was due ${new Date(r.due_at).toLocaleString()})` : ''}.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tasks/${r.task_id}">View Task</a></p>`,
            });
          } catch (e) {
            // ignore email failures
          }
        }
      }
    }

    res.json({ success: true, created, dueSoon: (dueSoon || []).length, overdue: (overdue || []).length });
  } catch (error) {
    console.error('runDeadlineReminders error:', error);
    res.status(500).json({ message: 'Failed to run deadline reminders', error: error.message });
  }
};
