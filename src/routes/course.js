const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    validateCourse
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// Semua endpoint hanya untuk admin
router.get('/', authenticate, authorize('admin'), getAllCourses);
router.get('/:id', authenticate, authorize('admin'), getCourseById);
router.post('/', authenticate, authorize('admin'), validateCourse, createCourse);
router.put('/:id', authenticate, authorize('admin'), validateCourse, updateCourse);
router.delete('/:id', authenticate, authorize('admin'), deleteCourse);

module.exports = router;
