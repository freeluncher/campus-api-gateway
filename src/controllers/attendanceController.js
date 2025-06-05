const Attendance = require('../models/attendance');
const { body, validationResult } = require('express-validator');

// Validation and sanitization for attendance
const validateAttendance = [
    body('student').trim().notEmpty().withMessage('Student is required'),
    body('date').isISO8601().withMessage('Date must be in ISO8601 format (YYYY-MM-DD)'),
    body('status').isIn(['present', 'permission', 'sick', 'absent']).withMessage('Invalid status'),
];

// Get all attendance
const getAllAttendance = async (req, res) => {
    try {
        const data = await Attendance.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new attendance
const addAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { student, date, status } = req.body;
        const newData = new Attendance({ student, date, status });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
    try {
        const data = await Attendance.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update attendance by ID
const updateAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { student, date, status } = req.body;
        const updated = await Attendance.findByIdAndUpdate(
            req.params.id,
            { student, date, status },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Data not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Delete attendance by ID
const deleteAttendance = async (req, res) => {
    try {
        const deleted = await Attendance.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllAttendance,
    addAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    validateAttendance
};
