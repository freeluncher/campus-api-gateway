const Schedule = require('../models/schedule');
const { body, validationResult } = require('express-validator');

// Validasi dan sanitasi input untuk jadwal
const validateSchedule = [
    body('matkul').trim().notEmpty().withMessage('Nama matkul wajib diisi'),
    body('dosen').trim().notEmpty().withMessage('Nama dosen wajib diisi'),
    body('ruang').trim().notEmpty().withMessage('Ruang wajib diisi'),
    body('hari').isIn(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']).withMessage('Hari tidak valid'),
    body('jamMulai').trim().notEmpty().withMessage('Jam mulai wajib diisi'),
    body('jamSelesai').trim().notEmpty().withMessage('Jam selesai wajib diisi'),
];

// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const data = await Schedule.find().sort({ hari: 1, jamMulai: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new schedule
const addSchedule = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { matkul, dosen, ruang, hari, jamMulai, jamSelesai } = req.body;
        const newData = new Schedule({ matkul, dosen, ruang, hari, jamMulai, jamSelesai });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Get schedule by ID
const getScheduleById = async (req, res) => {
    try {
        const data = await Schedule.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update schedule by ID
const updateSchedule = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { matkul, dosen, ruang, hari, jamMulai, jamSelesai } = req.body;
        const updated = await Schedule.findByIdAndUpdate(
            req.params.id,
            { matkul, dosen, ruang, hari, jamMulai, jamSelesai },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Delete schedule by ID
const deleteSchedule = async (req, res) => {
    try {
        const deleted = await Schedule.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json({ message: 'Data berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllSchedules,
    addSchedule,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    validateSchedule
};
