const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const controller = require('../controllers/notificationController');

const router = express.Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get('/', controller.list);
router.get('/unread-count', controller.unreadCount);
router.post('/read-all', controller.markAllRead);
router.post('/:id/read', controller.markRead);

// Admin/Managers can trigger reminder run (wire this to a cron in production)
router.post(
  '/run-deadline-reminders',
  authorizeRoles('Admin', 'Director', 'Account Manager', 'Project Manager'),
  controller.runDeadlineReminders,
);

module.exports = router;
