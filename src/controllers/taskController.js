const Task = require('../models/task');
const Enrollment = require('../models/enrollment');
const { body, validationResult } = require('express-validator');

// Validasi dan sanitasi input untuk tugas
const validateTask = [
    body('judul').trim().notEmpty().withMessage('Judul wajib diisi'),
    body('deskripsi').trim().notEmpty().withMessage('Deskripsi wajib diisi'),
    body('deadline').isISO8601().withMessage('Deadline wajib format ISO8601 (YYYY-MM-DD)'),
    body('status').optional().isIn(['belum', 'proses', 'selesai']).withMessage('Status tidak valid'),
    body('matkul').trim().notEmpty().withMessage('Matkul wajib diisi'),
    body('tahunAjaran').trim().notEmpty().withMessage('Tahun ajaran wajib diisi'),
    body('semester').isIn(['ganjil', 'genap']).withMessage('Semester harus ganjil/genap'),
];

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const data = await Task.find().sort({ deadline: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new task (otomatisasi penugasan ke seluruh mahasiswa yang diajar dosen)
const addTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { judul, deskripsi, deadline, status, matkul, tahunAjaran, semester } = req.body;
        // Ambil id dosen dari req.user (asumsi dosen login)
        const dosenId = req.user.id;
        // Cari semua mahasiswa yang enroll matkul ini dengan dosen ini di tahun ajaran & semester tsb
        const enrollments = await Enrollment.find({
            matkul,
            dosen: dosenId,
            tahunAjaran,
            semester
        });
        if (!enrollments.length) {
            return res.status(400).json({ error: 'Tidak ada mahasiswa yang terdaftar di matkul ini.' });
        }
        const mahasiswa = enrollments.map(e => e.mahasiswa);
        const newData = new Task({ judul, deskripsi, deadline, status, mahasiswa });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const data = await Task.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task by ID
const updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { judul, deskripsi, deadline, status, mahasiswa } = req.body;
        const updated = await Task.findByIdAndUpdate(
            req.params.id,
            { judul, deskripsi, deadline, status, mahasiswa },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Delete task by ID
const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json({ message: 'Data berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllTasks,
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    validateTask
};
