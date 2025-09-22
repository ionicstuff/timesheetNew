const express = require('express');
const spocController = require('../controllers/spocController');
const authorizeRoles = require('../middleware/authorizeRoles');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All SPOC routes require authentication
router.use(authMiddleware);

// SPOC routes
// List all spocs (admin/manager level)
router.get('/', authorizeRoles('Admin', 'Director', 'Account Manager', 'Project Manager'), spocController.getAllSpocs);
// List spocs for a client (any authenticated user)
router.get('/client/:clientId', spocController.getSpocsByClient);
// Create/Update/Delete restricted to management roles
router.post('/', authorizeRoles('Admin', 'Director', 'Account Manager', 'Project Manager'), spocController.createSpoc);
router.put('/:id', authorizeRoles('Admin', 'Director', 'Account Manager', 'Project Manager'), spocController.updateSpoc);
router.delete('/:id', authorizeRoles('Admin', 'Director', 'Account Manager', 'Project Manager'), spocController.deleteSpoc);

module.exports = router;
