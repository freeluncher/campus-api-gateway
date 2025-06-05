const Course = require('../models/course');
const { body, validationResult } = require('express-validator');

const validateCourse = [
    body('nama').trim().notEmpty().withMessage('Nama matkul wajib diisi'),
    body('dosen').isMongoId().withMessage('Dosen harus berupa ObjectId user valid'),
    body('tahunAjaran').trim().notEmpty().withMessage('Tahun ajaran wajib diisi'),
    body('semester').isIn(['ganjil', 'genap']).withMessage('Semester harus ganjil/genap'),
];

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const filter = {};
        if (req.query.tahunAjaran) filter.tahunAjaran = req.query.tahunAjaran;
        if (req.query.semester) filter.semester = req.query.semester;
        const data = await Course.find(filter).populate('dosen', '-password');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const data = await Course.findById(req.params.id).populate('dosen', '-password');
        if (!data) return res.status(404).json({ error: 'Matkul tidak ditemukan' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create course (by admin)
const createCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { nama, dosen, tahunAjaran, semester } = req.body;
        const exist = await Course.findOne({ nama, tahunAjaran, semester });
        if (exist) return res.status(400).json({ error: 'Matkul sudah ada di tahun/semester ini' });
        const course = new Course({ nama, dosen, tahunAjaran, semester });
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Update course (by admin)
const updateCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { nama, dosen, tahunAjaran, semester } = req.body;
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { nama, dosen, tahunAjaran, semester },
            { new: true, runValidators: true }
        ).populate('dosen', '-password');
        if (!course) return res.status(404).json({ error: 'Matkul tidak ditemukan' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Delete course (by admin)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ error: 'Matkul tidak ditemukan' });
        res.json({ message: 'Matkul berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    validateCourse
};
