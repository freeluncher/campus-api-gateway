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
const { authenticate, authorize, permit } = require('../controllers/authMiddleware');

// GET /api/schedule
router.get('/', authenticate, permit('schedule:read'), getAllSchedules);
// POST /api/schedule
router.post('/', authenticate, authorize('lecturer', 'admin'), permit('schedule:create'), validateSchedule, addSchedule);
// GET /api/schedule/:id
router.get('/:id', authenticate, permit('schedule:read'), getScheduleById);
// PUT /api/schedule/:id
router.put('/:id', authenticate, authorize('lecturer', 'admin'), permit('schedule:update'), validateSchedule, updateSchedule);
// DELETE /api/schedule/:id
router.delete('/:id', authenticate, authorize('admin'), permit('schedule:delete'), deleteSchedule);

module.exports = router;
