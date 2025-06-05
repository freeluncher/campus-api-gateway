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
const { authenticate, authorize } = require('../controllers/authMiddleware');

// GET /api/task
router.get('/', authenticate, getAllTasks);
// POST /api/task
router.post('/', authenticate, authorize('lecturer', 'admin'), validateTask, addTask);
// GET /api/task/:id
router.get('/:id', authenticate, getTaskById);
// PUT /api/task/:id
router.put('/:id', authenticate, authorize('lecturer', 'admin'), validateTask, updateTask);
// DELETE /api/task/:id
router.delete('/:id', authenticate, authorize('admin'), deleteTask);

module.exports = router;
