const Schedule = require('../models/schedule');
const { body, validationResult } = require('express-validator');

// Validasi dan sanitasi input untuk jadwal
const validateSchedule = [
    body('course').trim().notEmpty().withMessage('Course is required'),
    body('lecturer').trim().notEmpty().withMessage('Lecturer is required'),
    body('room').trim().notEmpty().withMessage('Room is required'),
    body('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).withMessage('Invalid day'),
    body('startTime').trim().notEmpty().withMessage('Start time is required'),
    body('endTime').trim().notEmpty().withMessage('End time is required'),
];

// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const data = await Schedule.find().sort({ day: 1, startTime: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

// Add new schedule
const addSchedule = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { course, lecturer, room, day, startTime, endTime } = req.body;
        const newData = new Schedule({ course, lecturer, room, day, startTime, endTime });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

// Get schedule by ID
const getScheduleById = async (req, res) => {
    try {
        const data = await Schedule.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

// Update schedule by ID
const updateSchedule = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { course, lecturer, room, day, startTime, endTime } = req.body;
        const updated = await Schedule.findByIdAndUpdate(
            req.params.id,
            { course, lecturer, room, day, startTime, endTime },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Data not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

// Delete schedule by ID
const deleteSchedule = async (req, res) => {
    try {
        const deleted = await Schedule.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Data not found' });
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

module.exports = {
    getAllSchedules,
    addSchedule,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    validateSchedule
};
