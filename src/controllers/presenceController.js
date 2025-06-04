const Presensi = require('../models/presence');

// Get all presensi
const getAllPresensi = async (req, res) => {
    try {
        const data = await Presensi.find().sort({ tanggal: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new presensi
const addPresensi = async (req, res) => {
    try {
        const { mahasiswa, tanggal, status } = req.body;
        if (!mahasiswa || !tanggal || !status) {
            return res.status(400).json({ error: 'Semua field wajib diisi' });
        }
        const newData = new Presensi({ mahasiswa, tanggal, status });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get presensi by ID
const getPresensiById = async (req, res) => {
    try {
        const data = await Presensi.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update presensi by ID
const updatePresensi = async (req, res) => {
    try {
        const { mahasiswa, tanggal, status } = req.body;
        const updated = await Presensi.findByIdAndUpdate(
            req.params.id,
            { mahasiswa, tanggal, status },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete presensi by ID
const deletePresensi = async (req, res) => {
    try {
        const deleted = await Presensi.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json({ message: 'Data berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllPresensi,
    addPresensi,
    getPresensiById,
    updatePresensi,
    deletePresensi
};
