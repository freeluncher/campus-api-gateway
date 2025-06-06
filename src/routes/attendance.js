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
const { authenticate, authorize, permit } = require('../controllers/authMiddleware');

// GET /api/attendance
router.get('/', authenticate, permit('attendance:read'), getAllAttendance);
// POST /api/attendance (now expects proof as path string, not file)
router.post('/', authenticate, authorize('student'), permit('attendance:create'), validateAttendance, addAttendance);
// GET /api/attendance/:id
router.get('/:id', authenticate, permit('attendance:read'), getAttendanceById);
// PUT /api/attendance/:id
router.put('/:id', authenticate, authorize('student', 'admin'), permit('attendance:update'), validateAttendance, updateAttendance);
// DELETE /api/attendance/:id
router.delete('/:id', authenticate, authorize('admin'), permit('attendance:delete'), deleteAttendance);

module.exports = router;
