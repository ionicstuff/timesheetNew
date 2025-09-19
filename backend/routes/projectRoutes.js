// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();

// Make sure this path is correct relative to THIS file
const ctrl = require('../controllers/projectController');
const { authMiddleware } = require('../middleware/auth');

// Require authentication for all project routes so req.user is populated
router.use(authMiddleware);

// ---- Directory Helpers ----
router.get('/managers', ctrl.getManagers);
router.get('/users', ctrl.getUsers);
router.get('/clients', ctrl.getClients);
router.get('/clients/:id(\\d+)/spocs', ctrl.getClientSpocs);

// ---- Projects ----
router.get('/', ctrl.getProjects);
router.get('/my', ctrl.getMyProjects); // requires auth via router.use(authMiddleware)
router.post('/', ctrl.createProject);
router.get('/:id(\\d+)', ctrl.getProject);
router.put('/:id(\\d+)', ctrl.updateProject);
router.delete('/:id(\\d+)', ctrl.deleteProject);
router.patch('/:id(\\d+)/details', ctrl.updateProjectDetails);

// ---- Files ----
router.post('/:id(\\d+)/files', ctrl.uploadProjectFiles);
router.get('/:id(\\d+)/files', ctrl.getProjectFiles);

// ---- Performance & State ----
router.post('/:id(\\d+)/close', ctrl.closeProject);
router.get('/:id(\\d+)/performance', ctrl.getProjectPerformance);

// ---- Project Members (nested) ----
router.use('/:projectId(\\d+)/members', require('./projectMemberRoutes'));

module.exports = router;
