const Task = require('../models/task');
const Enrollment = require('../models/enrollment');
const { body, validationResult } = require('express-validator');

// Validasi dan sanitasi input untuk tugas
const validateTask = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('deadline').isISO8601().withMessage('Deadline must be in ISO8601 format (YYYY-MM-DD)'),
    body('status').optional().isIn(['not_started', 'in_progress', 'completed']).withMessage('Invalid status'),
    body('course').trim().notEmpty().withMessage('Course is required'),
    body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
    body('semester').isIn(['odd', 'even']).withMessage('Semester must be odd/even'),
];

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const data = await Task.find().sort({ deadline: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new task (otomatisasi penugasan ke seluruh mahasiswa yang diajar dosen)
const addTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, deadline, status, course, academicYear, semester } = req.body;
        // Ambil id dosen dari req.user (asumsi dosen login)
        const lecturerId = req.user.id;
        // Cari semua mahasiswa yang enroll matkul ini dengan dosen ini di tahun ajaran & semester tsb
        const enrollments = await Enrollment.find({
            course,
            lecturer: lecturerId,
            academicYear,
            semester
        });
        if (!enrollments.length) {
            return res.status(400).json({ error: 'No students enrolled in this course.' });
        }
        const students = enrollments.map(e => e.student);
        const newData = new Task({ title, description, deadline, status, students });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const data = await Task.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task by ID
const updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, deadline, status, students } = req.body;
        const updated = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, deadline, status, students },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Data not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Delete task by ID
const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllTasks,
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    validateTask
};
