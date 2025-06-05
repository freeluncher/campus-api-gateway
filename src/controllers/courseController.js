const Course = require('../models/course');
const { body, validationResult } = require('express-validator');

const validateCourse = [
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('lecturers').isArray({ min: 1 }).withMessage('At least one lecturer is required'),
    body('lecturers.*').isMongoId().withMessage('Each lecturer must be a valid user ObjectId'),
    body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
    body('semester').isIn(['odd', 'even']).withMessage('Semester must be odd/even'),
];

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const filter = {};
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        if (req.query.semester) filter.semester = req.query.semester;
        const data = await Course.find(filter).populate('lecturers', '-password');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const data = await Course.findById(req.params.id).populate('lecturers', '-password');
        if (!data) return res.status(404).json({ error: 'Course not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create course (by admin)
const createCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, lecturers, academicYear, semester } = req.body;
        const exist = await Course.findOne({ name, academicYear, semester });
        if (exist) return res.status(400).json({ error: 'Course already exists for this academic year/semester' });
        const course = new Course({ name, lecturers, academicYear, semester });
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Update course (by admin)
const updateCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, lecturers, academicYear, semester } = req.body;
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { name, lecturers, academicYear, semester },
            { new: true, runValidators: true }
        ).populate('lecturers', '-password');
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Delete course (by admin)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    validateCourse
};
