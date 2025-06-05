const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const validateUser = [
    body('username').trim().notEmpty().withMessage('Username wajib diisi'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('role').isIn(['mahasiswa', 'dosen', 'admin']).withMessage('Role tidak valid'),
    body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
];

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create user (by admin)
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password, role, nama } = req.body;
        const exist = await User.findOne({ username });
        if (exist) return res.status(400).json({ error: 'Username sudah terdaftar' });
        const hashed = password ? await bcrypt.hash(password, 10) : undefined;
        const user = new User({ username, password: hashed, role, nama });
        await user.save();
        res.status(201).json({ message: 'User berhasil dibuat', user: { id: user._id, username, role, nama } });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Update user (by admin)
const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password, role, nama } = req.body;
        const update = { username, role, nama };
        if (password) update.password = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
        res.json({ message: 'User berhasil diupdate', user });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Delete user (by admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
        res.json({ message: 'User berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    validateUser
};
