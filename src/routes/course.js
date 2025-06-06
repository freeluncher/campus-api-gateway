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
const { authenticate, authorize, permit } = require('../controllers/authMiddleware');

// GET /api/course/available?semester=odd&academicYear=2025/2026
router.get('/available', authenticate, authorize('student'), async (req, res) => {
    try {
        const filter = {};
        if (req.query.semester) filter.semester = req.query.semester;
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        // Only courses not yet taken by this student
        const Enrollment = require('../models/enrollment');
        const enrolled = await Enrollment.find({ student: req.user.id });
        const takenCourses = enrolled.map(e => e.course.toString());
        filter._id = { $nin: takenCourses };
        const data = await require('../models/course').find(filter).populate('lecturers', '-password');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// All endpoints for admin only
router.get('/', authenticate, authorize('admin'), permit('course:read'), getAllCourses);
router.get('/:id', authenticate, authorize('admin'), permit('course:read'), getCourseById);
router.post('/', authenticate, authorize('admin'), permit('course:create'), validateCourse, createCourse);
router.put('/:id', authenticate, authorize('admin'), permit('course:update'), validateCourse, updateCourse);
router.delete('/:id', authenticate, authorize('admin'), permit('course:delete'), deleteCourse);

module.exports = router;
