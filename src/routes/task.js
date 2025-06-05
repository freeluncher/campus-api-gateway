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

// GET /api/tugas
router.get('/', authenticate, getAllTasks);
// POST /api/tugas
router.post('/', authenticate, authorize('dosen', 'admin'), validateTask, addTask);
// GET /api/tugas/:id
router.get('/:id', authenticate, getTaskById);
// PUT /api/tugas/:id
router.put('/:id', authenticate, authorize('dosen', 'admin'), validateTask, updateTask);
// DELETE /api/tugas/:id
router.delete('/:id', authenticate, authorize('admin'), deleteTask);

module.exports = router;
