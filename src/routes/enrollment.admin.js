const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollment');
const { authenticate, authorize } = require('../controllers/authMiddleware');
const { validateEnrollment } = require('../controllers/enrollmentController');

// Get all enrollments (admin)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const filter = {};
        if (req.query.mahasiswa) filter.mahasiswa = req.query.mahasiswa;
        if (req.query.dosen) filter.dosen = req.query.dosen;
        if (req.query.matkul) filter.matkul = req.query.matkul;
        if (req.query.tahunAjaran) filter.tahunAjaran = req.query.tahunAjaran;
        if (req.query.semester) filter.semester = req.query.semester;
        const data = await Enrollment.find(filter).populate('mahasiswa dosen matkul');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get enrollment by ID (admin)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const data = await Enrollment.findById(req.params.id).populate('mahasiswa dosen matkul');
        if (!data) return res.status(404).json({ error: 'Enrollment tidak ditemukan' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create enrollment (admin)
router.post('/', authenticate, authorize('admin'), validateEnrollment, async (req, res) => {
    try {
        const { mahasiswa, matkul } = req.body;
        const course = await require('../models/course').findById(matkul);
        if (!course) return res.status(404).json({ error: 'Matkul tidak ditemukan' });
        const exist = await Enrollment.findOne({ mahasiswa, matkul, tahunAjaran: course.tahunAjaran, semester: course.semester });
        if (exist) return res.status(400).json({ error: 'Sudah terdaftar di matkul ini' });
        const data = new Enrollment({ mahasiswa, matkul, dosen: course.dosen, tahunAjaran: course.tahunAjaran, semester: course.semester });
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// Update enrollment (admin)
router.put('/:id', authenticate, authorize('admin'), validateEnrollment, async (req, res) => {
    try {
        const { mahasiswa, matkul } = req.body;
        const course = await require('../models/course').findById(matkul);
        if (!course) return res.status(404).json({ error: 'Matkul tidak ditemukan' });
        const update = {
            mahasiswa,
            matkul,
            dosen: course.dosen,
            tahunAjaran: course.tahunAjaran,
            semester: course.semester
        };
        const data = await Enrollment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate('mahasiswa dosen matkul');
        if (!data) return res.status(404).json({ error: 'Enrollment tidak ditemukan' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// Delete enrollment (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const data = await Enrollment.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ error: 'Enrollment tidak ditemukan' });
        res.json({ message: 'Enrollment berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
