const express = require('express');
const router = express.Router({ mergeParams: true });
const { listMessages, createMessage } = require('../controllers/projectMessageController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', listMessages);
router.post('/', createMessage);

module.exports = router;
