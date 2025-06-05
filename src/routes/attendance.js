const express = require('express');
const router = express.Router();
const {
    getAllAttendance,
    addAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    validateAttendance
} = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// GET /api/attendance
router.get('/', authenticate, getAllAttendance);
// POST /api/attendance
router.post('/', authenticate, authorize('student', 'admin'), validateAttendance, addAttendance);
// GET /api/attendance/:id
router.get('/:id', authenticate, getAttendanceById);
// PUT /api/attendance/:id
router.put('/:id', authenticate, authorize('student', 'admin'), validateAttendance, updateAttendance);
// DELETE /api/attendance/:id
router.delete('/:id', authenticate, authorize('admin'), deleteAttendance);

module.exports = router;
