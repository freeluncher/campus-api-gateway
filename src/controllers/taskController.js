const Task = require('../models/task');
const Enrollment = require('../models/enrollment');
const Course = require('../models/course');
const { body, validationResult } = require('express-validator');
const { sendEmail } = require('../utils/email');

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
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
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
        const lecturerId = req.user.id;
        // Cek apakah dosen yang login adalah salah satu lecturers di course
        const courseData = await Course.findById(course);
        if (!courseData) return res.status(404).json({ error: 'Course not found' });
        if (!courseData.lecturers.map(id => id.toString()).includes(lecturerId)) {
            return res.status(403).json({ error: 'You are not a lecturer for this course.' });
        }
        // Cari semua mahasiswa yang enroll course ini di academicYear & semester
        const enrollments = await Enrollment.find({
            course,
            academicYear,
            semester
        }).populate('student');
        if (!enrollments.length) {
            return res.status(400).json({ error: 'No students enrolled in this course.' });
        }
        const students = enrollments.map(e => e.student._id);
        const emails = enrollments.map(e => e.student.username).filter(email => email && email.includes('@'));
        const newData = new Task({ title, description, deadline, status, students });
        await newData.save();
        // Kirim notifikasi email ke semua mahasiswa
        for (const email of emails) {
            await sendEmail(email, 'New Task Assigned', `<b>You have a new task:</b> ${title}<br>${description}`);
        }
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const data = await Task.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
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
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

// Delete task by ID
const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
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
