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
const { authenticate, authorize } = require('../controllers/authMiddleware');

// GET /api/presensi
router.get('/', authenticate, getAllPresensi);
// POST /api/presensi
router.post('/', authenticate, authorize('mahasiswa', 'admin'), validatePresensi, addPresensi);
// GET /api/presensi/:id
router.get('/:id', authenticate, getPresensiById);
// PUT /api/presensi/:id
router.put('/:id', authenticate, authorize('mahasiswa', 'admin'), validatePresensi, updatePresensi);
// DELETE /api/presensi/:id
router.delete('/:id', authenticate, authorize('admin'), deletePresensi);

module.exports = router;
