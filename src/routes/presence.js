const express = require('express');
const router = express.Router();
const {
    getAllPresensi,
    addPresensi,
    getPresensiById,
    updatePresensi,
    deletePresensi,
    validatePresensi
} = require('../controllers/presenceController');

// GET /api/presensi
router.get('/', getAllPresensi);
// POST /api/presensi
router.post('/', validatePresensi, addPresensi);
// GET /api/presensi/:id
router.get('/:id', getPresensiById);
// PUT /api/presensi/:id
router.put('/:id', validatePresensi, updatePresensi);
// DELETE /api/presensi/:id
router.delete('/:id', deletePresensi);

module.exports = router;
