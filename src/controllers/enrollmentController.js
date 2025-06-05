const Enrollment = require('../models/enrollment');
const Course = require('../models/course');
const { body, validationResult } = require('express-validator');

const validateEnrollment = [
    body('matkul').isMongoId().withMessage('Matkul harus berupa ObjectId course valid'),
    body('mahasiswa').optional().isMongoId().withMessage('Mahasiswa harus berupa ObjectId user valid'),
    body('tahunAjaran').trim().notEmpty().withMessage('Tahun ajaran wajib diisi'),
    body('semester').isIn(['ganjil', 'genap']).withMessage('Semester harus ganjil/genap'),
];

// Mahasiswa memilih matkul (enroll)
const enrollMatkul = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { matkul } = req.body;
        const mahasiswa = req.user.id;
        // Ambil data course
        const course = await Course.findById(matkul);
        if (!course) return res.status(404).json({ error: 'Matkul tidak ditemukan' });
        // Cek duplikat
        const exist = await Enrollment.findOne({ mahasiswa, matkul, tahunAjaran: course.tahunAjaran, semester: course.semester });
        if (exist) return res.status(400).json({ error: 'Sudah terdaftar di matkul ini' });
        const data = new Enrollment({ mahasiswa, matkul, dosen: course.dosen, tahunAjaran: course.tahunAjaran, semester: course.semester });
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Dosen/mahasiswa/admin melihat daftar enroll
const getEnrollments = async (req, res) => {
    try {
        const filter = {};
        if (req.query.mahasiswa) filter.mahasiswa = req.query.mahasiswa;
        if (req.query.dosen) filter.dosen = req.query.dosen;
        if (req.query.matkul) filter.matkul = req.query.matkul;
        if (req.query.tahunAjaran) filter.tahunAjaran = req.query.tahunAjaran;
        if (req.query.semester) filter.semester = req.query.semester;
        const data = await Enrollment.find(filter).populate('mahasiswa dosen');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { enrollMatkul, getEnrollments, validateEnrollment };
