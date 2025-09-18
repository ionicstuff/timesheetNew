// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();

// Make sure this path is correct relative to THIS file
const ctrl = require('../controllers/projectController');

// ---- Projects ----
router.get('/', ctrl.getProjects);
router.get('/my', ctrl.getMyProjects);
router.get('/:id', ctrl.getProject);
router.post('/', ctrl.createProject);
router.put('/:id', ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);
router.patch('/:id/details', ctrl.updateProjectDetails);

// ---- Files ----
router.post('/:id/files', ctrl.uploadProjectFiles);
router.get('/:id/files', ctrl.getProjectFiles);

// ---- Performance & State ----
router.post('/:id/close', ctrl.closeProject);
router.get('/:id/performance', ctrl.getProjectPerformance);

// ---- Directory Helpers ----
router.get('/managers', ctrl.getManagers);
router.get('/users', ctrl.getUsers);

// ---- NEW: Clients & SPOCs ----
router.get('/clients', ctrl.getClients);
router.get('/clients/:id/spocs', ctrl.getClientSpocs);

module.exports = router;
