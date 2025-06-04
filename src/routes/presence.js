const express = require('express');
const router = express.Router();
const {
    getAllPresensi,
    addPresensi,
    getPresensiById,
    updatePresensi,
    deletePresensi
} = require('../controllers/presenceController');

// GET /api/presensi
router.get('/', getAllPresensi);
// POST /api/presensi
router.post('/', addPresensi);
// GET /api/presensi/:id
router.get('/:id', getPresensiById);
// PUT /api/presensi/:id
router.put('/:id', updatePresensi);
// DELETE /api/presensi/:id
router.delete('/:id', deletePresensi);

module.exports = router;
