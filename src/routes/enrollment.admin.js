const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollment');
const { authenticate, authorize } = require('../controllers/authMiddleware');
const { validateEnrollment } = require('../controllers/enrollmentController');

// Get all enrollments (admin)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const filter = {};
        if (req.query.student) filter.student = req.query.student;
        if (req.query.lecturer) filter.lecturer = req.query.lecturer;
        if (req.query.course) filter.course = req.query.course;
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        if (req.query.semester) filter.semester = req.query.semester;
        const data = await Enrollment.find(filter).populate('student lecturer course');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get enrollment by ID (admin)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const data = await Enrollment.findById(req.params.id).populate('student lecturer course');
        if (!data) return res.status(404).json({ error: 'Enrollment not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create enrollment (admin)
router.post('/', authenticate, authorize('admin'), validateEnrollment, async (req, res) => {
    try {
        const { student, course } = req.body;
        const courseData = await require('../models/course').findById(course);
        if (!courseData) return res.status(404).json({ error: 'Course not found' });
        const exist = await Enrollment.findOne({ student, course, academicYear: courseData.academicYear, semester: courseData.semester });
        if (exist) return res.status(400).json({ error: 'Already enrolled in this course' });
        const data = new Enrollment({ student, course, lecturer: courseData.lecturer, academicYear: courseData.academicYear, semester: courseData.semester });
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Update enrollment (admin)
router.put('/:id', authenticate, authorize('admin'), validateEnrollment, async (req, res) => {
    try {
        const { student, course } = req.body;
        const courseData = await require('../models/course').findById(course);
        if (!courseData) return res.status(404).json({ error: 'Course not found' });
        const update = {
            student,
            course,
            lecturer: courseData.lecturer,
            academicYear: courseData.academicYear,
            semester: courseData.semester
        };
        const data = await Enrollment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate('student lecturer course');
        if (!data) return res.status(404).json({ error: 'Enrollment not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Delete enrollment (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const data = await Enrollment.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ error: 'Enrollment not found' });
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
