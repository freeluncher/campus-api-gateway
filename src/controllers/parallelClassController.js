const ParallelClass = require('../models/parallelClass');
const { body, validationResult } = require('express-validator');

const validateParallelClass = [
    body('course').isMongoId().withMessage('Course must be a valid ObjectId'),
    body('code').trim().notEmpty().withMessage('Parallel class code is required'),
    body('name').trim().notEmpty().withMessage('Parallel class name is required'),
    body('lecturers').isArray({ min: 1 }).withMessage('At least one lecturer is required'),
    body('lecturers.*').isMongoId().withMessage('Each lecturer must be a valid user ObjectId'),
    body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
    body('semester').isIn(['odd', 'even']).withMessage('Semester must be odd/even'),
];

const getAllParallelClasses = async (req, res) => {
    try {
        const filter = {};
        if (req.query.course) filter.course = req.query.course;
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        if (req.query.semester) filter.semester = req.query.semester;
        const data = await ParallelClass.find(filter).populate('course lecturers', '-password');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

const getParallelClassById = async (req, res) => {
    try {
        const data = await ParallelClass.findById(req.params.id).populate('course lecturers', '-password');
        if (!data) return res.status(404).json({ error: 'Parallel class not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

const createParallelClass = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { course, code, name, lecturers, academicYear, semester } = req.body;
        const exist = await ParallelClass.findOne({ course, code, academicYear, semester });
        if (exist) return res.status(400).json({ error: 'Parallel class already exists for this course/code/year/semester' });
        const parallelClass = new ParallelClass({ course, code, name, lecturers, academicYear, semester });
        await parallelClass.save();
        res.status(201).json(parallelClass);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

const updateParallelClass = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { course, code, name, lecturers, academicYear, semester } = req.body;
        const parallelClass = await ParallelClass.findByIdAndUpdate(
            req.params.id,
            { course, code, name, lecturers, academicYear, semester },
            { new: true, runValidators: true }
        ).populate('course lecturers', '-password');
        if (!parallelClass) return res.status(404).json({ error: 'Parallel class not found' });
        res.json(parallelClass);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

const deleteParallelClass = async (req, res) => {
    try {
        const parallelClass = await ParallelClass.findByIdAndDelete(req.params.id);
        if (!parallelClass) return res.status(404).json({ error: 'Parallel class not found' });
        res.json({ message: 'Parallel class deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

module.exports = {
    getAllParallelClasses,
    getParallelClassById,
    createParallelClass,
    updateParallelClass,
    deleteParallelClass,
    validateParallelClass
};
