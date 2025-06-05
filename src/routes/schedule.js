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

// GET /api/jadwal
router.get('/', getAllSchedules);
// POST /api/jadwal
router.post('/', validateSchedule, addSchedule);
// GET /api/jadwal/:id
router.get('/:id', getScheduleById);
// PUT /api/jadwal/:id
router.put('/:id', validateSchedule, updateSchedule);
// DELETE /api/jadwal/:id
router.delete('/:id', deleteSchedule);

module.exports = router;
