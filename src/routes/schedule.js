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

// GET /api/schedule
router.get('/', authenticate, getAllSchedules);
// POST /api/schedule
router.post('/', authenticate, authorize('lecturer', 'admin'), validateSchedule, addSchedule);
// GET /api/schedule/:id
router.get('/:id', authenticate, getScheduleById);
// PUT /api/schedule/:id
router.put('/:id', authenticate, authorize('lecturer', 'admin'), validateSchedule, updateSchedule);
// DELETE /api/schedule/:id
router.delete('/:id', authenticate, authorize('admin'), deleteSchedule);

module.exports = router;
