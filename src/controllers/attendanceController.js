const Attendance = require('../models/attendance');
const Enrollment = require('../models/enrollment');
const Schedule = require('../models/schedule');
const { body, validationResult } = require('express-validator');

// Validation and sanitization for attendance
const validateAttendance = [
    body('student').trim().notEmpty().withMessage('Student is required'),
    body('course').trim().notEmpty().withMessage('Course is required'),
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

// Add new attendance with schedule validation
const addAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { student, course, date, status } = req.body;
        // Check if student is enrolled in the course
        const enroll = await Enrollment.findOne({ student, course });
        if (!enroll) {
            return res.status(403).json({
                error: 'You are not enrolled in this course.',
                code: 'NOT_ENROLLED',
                detail: 'Student must be enrolled in the course to submit attendance.'
            });
        }
        // Validate attendance time against schedule
        const presensiDate = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[presensiDate.getDay()];
        const pad = n => n.toString().padStart(2, '0');
        const currentTime = pad(presensiDate.getHours()) + ':' + pad(presensiDate.getMinutes());
        const schedule = await Schedule.findOne({
            course,
            day: currentDay,
            startTime: { $lte: currentTime },
            endTime: { $gte: currentTime }
        });
        if (!schedule) {
            return res.status(403).json({
                error: 'Attendance is not allowed at this time. Out of schedule.',
                code: 'OUT_OF_SCHEDULE',
                detail: `No schedule found for course on ${currentDay} at ${currentTime}`
            });
        }
        // Save attendance if valid
        const newData = new Attendance({ student, course, date, status });
        await newData.save();
        res.status(201).json({
            message: 'Attendance recorded successfully.',
            data: newData
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR', detail: err.message });
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
