const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    validateCourse
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// GET /api/course/available?semester=ganjil&tahunAjaran=2025/2026
router.get('/available', authenticate, authorize('mahasiswa'), async (req, res) => {
    try {
        const filter = {};
        if (req.query.semester) filter.semester = req.query.semester;
        if (req.query.tahunAjaran) filter.tahunAjaran = req.query.tahunAjaran;
        // Hanya matkul yang belum diambil oleh mahasiswa ini
        const Enrollment = require('../models/enrollment');
        const enrolled = await Enrollment.find({ mahasiswa: req.user.id });
        const takenMatkul = enrolled.map(e => e.matkul.toString());
        filter._id = { $nin: takenMatkul };
        const data = await require('../models/course').find(filter).populate('dosen', '-password');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Semua endpoint hanya untuk admin
router.get('/', authenticate, authorize('admin'), getAllCourses);
router.get('/:id', authenticate, authorize('admin'), getCourseById);
router.post('/', authenticate, authorize('admin'), validateCourse, createCourse);
router.put('/:id', authenticate, authorize('admin'), validateCourse, updateCourse);
router.delete('/:id', authenticate, authorize('admin'), deleteCourse);

module.exports = router;
