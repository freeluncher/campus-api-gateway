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

// GET /api/tugas
router.get('/', getAllTasks);
// POST /api/tugas
router.post('/', validateTask, addTask);
// GET /api/tugas/:id
router.get('/:id', getTaskById);
// PUT /api/tugas/:id
router.put('/:id', validateTask, updateTask);
// DELETE /api/tugas/:id
router.delete('/:id', deleteTask);

module.exports = router;
