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
const { authenticate, authorize, permit } = require('../controllers/authMiddleware');

// All endpoints for admin only (can be adjusted for lecturer if needed)
router.get('/', authenticate, authorize('admin'), permit('parallel-class:read'), getAllParallelClasses);
router.get('/:id', authenticate, authorize('admin'), permit('parallel-class:read'), getParallelClassById);
router.post('/', authenticate, authorize('admin'), permit('parallel-class:create'), validateParallelClass, createParallelClass);
router.put('/:id', authenticate, authorize('admin'), permit('parallel-class:update'), validateParallelClass, updateParallelClass);
router.delete('/:id', authenticate, authorize('admin'), permit('parallel-class:delete'), deleteParallelClass);

module.exports = router;
