const express = require('express');
const router = express.Router();
const {
    getAllParallelClasses,
    getParallelClassById,
    createParallelClass,
    updateParallelClass,
    deleteParallelClass,
    validateParallelClass
} = require('../controllers/parallelClassController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// All endpoints for admin only (can be adjusted for lecturer if needed)
router.get('/', authenticate, authorize('admin'), getAllParallelClasses);
router.get('/:id', authenticate, authorize('admin'), getParallelClassById);
router.post('/', authenticate, authorize('admin'), validateParallelClass, createParallelClass);
router.put('/:id', authenticate, authorize('admin'), validateParallelClass, updateParallelClass);
router.delete('/:id', authenticate, authorize('admin'), deleteParallelClass);

module.exports = router;
