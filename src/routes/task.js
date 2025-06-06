const express = require('express');
const router = express.Router();
const {
    getAllTasks,
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    validateTask
} = require('../controllers/taskController');
const { authenticate, authorize, permit } = require('../controllers/authMiddleware');

// GET /api/task
router.get('/', authenticate, permit('task:read'), getAllTasks);
// POST /api/task
router.post('/', authenticate, authorize('lecturer', 'admin'), permit('task:create'), validateTask, addTask);
// GET /api/task/:id
router.get('/:id', authenticate, permit('task:read'), getTaskById);
// PUT /api/task/:id
router.put('/:id', authenticate, authorize('lecturer', 'admin'), permit('task:update'), validateTask, updateTask);
// DELETE /api/task/:id
router.delete('/:id', authenticate, authorize('admin'), permit('task:delete'), deleteTask);

module.exports = router;
