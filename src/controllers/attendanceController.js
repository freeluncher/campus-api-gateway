const Attendance = require('../models/attendance');
const Enrollment = require('../models/enrollment');
const Schedule = require('../models/schedule');
const Holiday = require('../models/holiday');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Setup multer for file upload (for permission/sick proof)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/attendance'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

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

// Add new attendance with schedule validation and detailed validation
const addAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { student, course, date, status } = req.body;
        // Cek user role (hanya student yang boleh submit presensi)
        if (!req.user || req.user.role !== 'student') {
            return res.status(403).json({
                error: 'Only students are allowed to submit attendance.',
                code: 'FORBIDDEN_ROLE',
                detail: 'Attendance can only be submitted by users with student role.'
            });
        }
        // Cek hari libur/nasional
        const presensiDate = new Date(date);
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
        const startOfDay = new Date(date);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(date);
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
        const currentDay = days[presensiDate.getDay()];
        const pad = n => n.toString().padStart(2, '0');
        const currentTime = pad(presensiDate.getHours()) + ':' + pad(presensiDate.getMinutes());
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
        // Validasi range waktu presensi (misal: 10 menit sebelum sampai 15 menit setelah jam mulai)
        const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
        const presensiMinutes = presensiDate.getHours() * 60 + presensiDate.getMinutes();
        const scheduleStartMinutes = startHour * 60 + startMinute - 10; // 10 menit sebelum
        const scheduleEndMinutes = startHour * 60 + startMinute + 15; // 15 menit setelah mulai
        if (presensiMinutes < scheduleStartMinutes || presensiMinutes > scheduleEndMinutes) {
            return res.status(403).json({
                error: 'Attendance not allowed outside allowed time window.',
                code: 'OUT_OF_TIME_WINDOW',
                detail: `Attendance allowed from ${pad(Math.floor(scheduleStartMinutes/60))}:${pad(scheduleStartMinutes%60)} to ${pad(Math.floor(scheduleEndMinutes/60))}:${pad(scheduleEndMinutes%60)}`
            });
        }
        // If status is 'permission' or 'sick', require file proof
        let proofFile = null;
        if (['permission', 'sick'].includes(status)) {
            if (!req.file) {
                return res.status(400).json({
                    error: 'Proof file is required for permission or sick status.',
                    code: 'PROOF_REQUIRED',
                    detail: 'Please upload a file as proof.'
                });
            }
            proofFile = req.file.filename;
        }
        // Save attendance with proofFile if available
        const newData = new Attendance({ student, course, date, status, proof: proofFile });
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
    validateAttendance,
    upload
};
