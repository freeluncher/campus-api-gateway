const express = require('express');
const router = express.Router();
const {
    getAllSchedules,
    addSchedule,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    validateSchedule
} = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// GET /api/jadwal
router.get('/', authenticate, getAllSchedules);
// POST /api/jadwal
router.post('/', authenticate, authorize('dosen', 'admin'), validateSchedule, addSchedule);
// GET /api/jadwal/:id
router.get('/:id', authenticate, getScheduleById);
// PUT /api/jadwal/:id
router.put('/:id', authenticate, authorize('dosen', 'admin'), validateSchedule, updateSchedule);
// DELETE /api/jadwal/:id
router.delete('/:id', authenticate, authorize('admin'), deleteSchedule);

module.exports = router;
