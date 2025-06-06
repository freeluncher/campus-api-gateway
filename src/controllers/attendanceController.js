const Attendance = require('../models/attendance');
const Enrollment = require('../models/enrollment');
const Schedule = require('../models/schedule');
const Holiday = require('../models/holiday');
const { body, validationResult } = require('express-validator');
const path = require('path');
const moment = require('moment-timezone');

// Validation and sanitization for attendance
const validateAttendance = [
    body('student').trim().notEmpty().withMessage('Student is required'),
    body('course').trim().notEmpty().withMessage('Course is required'),
    body('status').isIn(['present', 'permission', 'sick', 'absent']).withMessage('Invalid status'),
    body('proof').optional().isString().withMessage('Proof must be a string path'),
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

// Add new attendance with schedule validation and detailed validation
const addAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { student, course, status, proof } = req.body;
        // Cek user role (hanya student yang boleh submit presensi)
        if (!req.user || req.user.role !== 'student') {
            return res.status(403).json({
                error: 'Only students are allowed to submit attendance.',
                code: 'FORBIDDEN_ROLE',
                detail: 'Attendance can only be submitted by users with student role.'
            });
        }
        // Ambil tanggal presensi dari waktu server Asia/Jakarta
        const presensiMoment = moment.tz('Asia/Jakarta');
        const dateString = presensiMoment.format('YYYY-MM-DD');
        // Cek hari libur/nasional
        const presensiDate = new Date(dateString);
        const holiday = await Holiday.findOne({ date: {
            $gte: new Date(presensiDate.setHours(0,0,0,0)),
            $lte: new Date(presensiDate.setHours(23,59,59,999))
        }});
        if (holiday) {
            return res.status(403).json({
                error: 'Attendance is not allowed on a holiday.',
                code: 'HOLIDAY',
                detail: `Holiday: ${holiday.description}`
            });
        }
        // Check if student is enrolled in the course and enrollment is active
        const enroll = await Enrollment.findOne({ student, course, status: 'active' });
        if (!enroll) {
            return res.status(403).json({
                error: 'You are not actively enrolled in this course.',
                code: 'NOT_ACTIVE_ENROLLMENT',
                detail: 'Student must have an active enrollment to submit attendance.'
            });
        }
        // Cek duplikat presensi pada hari yang sama dan course yang sama
        const startOfDay = new Date(dateString);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(dateString);
        endOfDay.setHours(23,59,59,999);
        const alreadyPresent = await Attendance.findOne({
            student,
            course,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        if (alreadyPresent) {
            return res.status(400).json({
                error: 'Attendance already submitted for this course and date.',
                code: 'ALREADY_PRESENT',
                detail: 'Duplicate attendance is not allowed.'
            });
        }
        // Validate attendance time against schedule
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // Gunakan presensiMoment yang sudah dideklarasikan di atas
        const currentDay = days[presensiMoment.day()];
        const pad = n => n.toString().padStart(2, '0');
        // Ambil waktu presensi dari Asia/Jakarta (jam dan menit)
        const presensiHour = presensiMoment.hour();
        const presensiMinute = presensiMoment.minute();
        const currentTime = pad(presensiHour) + ':' + pad(presensiMinute);
        // Cari jadwal yang cocok (harus ada jadwal di hari itu)
        const schedule = await Schedule.findOne({
            course,
            day: currentDay
        });
        if (!schedule) {
            return res.status(403).json({
                error: 'No schedule found for this course on this day.',
                code: 'NO_SCHEDULE_TODAY',
                detail: `No schedule for course on ${currentDay}`
            });
        }
        // Validasi range waktu presensi (10 menit sebelum sampai 15 menit setelah jam mulai, waktu lokal)
        const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
        const presensiMinutes = presensiHour * 60 + presensiMinute;
        const scheduleStartMinutes = startHour * 60 + startMinute - 10; // 10 menit sebelum
        const scheduleEndMinutes = startHour * 60 + startMinute + 15; // 15 menit setelah mulai
        // DEBUG LOG
        // (log waktu presensi dihapus sesuai permintaan)
        if (presensiMinutes < scheduleStartMinutes || presensiMinutes > scheduleEndMinutes) {
            return res.status(403).json({
                error: 'Attendance not allowed outside allowed time window.',
                code: 'OUT_OF_TIME_WINDOW',
                detail: `Attendance allowed from ${pad(Math.floor(scheduleStartMinutes/60))}:${pad(scheduleStartMinutes%60)} to ${pad(Math.floor(scheduleEndMinutes/60))}:${pad(scheduleEndMinutes%60)}`
            });
        }
        // If status is 'permission' or 'sick', require proof path
        let proofPath = null;
        if (['permission', 'sick'].includes(status)) {
            if (!proof || typeof proof !== 'string') {
                return res.status(400).json({
                    error: 'Proof path is required for permission or sick status.',
                    code: 'PROOF_REQUIRED',
                    detail: 'Please upload file first and submit the path.'
                });
            }
            proofPath = proof;
        }
        // Simpan attendance dengan tanggal presensi hasil waktu server
        const newData = new Attendance({ student, course, date: dateString, status, proof: proofPath });
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
