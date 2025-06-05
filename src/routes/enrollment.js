const express = require('express');
const router = express.Router();
const { enrollMatkul, getEnrollments, validateEnrollment } = require('../controllers/enrollmentController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// Mahasiswa melakukan enroll matkul
router.post('/', authenticate, authorize('mahasiswa'), validateEnrollment, enrollMatkul);
// Semua user bisa melihat daftar enroll (bisa difilter via query)
router.get('/', authenticate, getEnrollments);

module.exports = router;
