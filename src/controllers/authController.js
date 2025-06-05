const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const register = async (req, res) => {
    try {
        const { username, password, role, nama } = req.body;
        if (!username || !password || !role || !nama) {
            return res.status(400).json({ error: 'Semua field wajib diisi' });
        }
        const exist = await User.findOne({ username });
        if (exist) return res.status(400).json({ error: 'Username sudah terdaftar' });
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed, role, nama });
        await user.save();
        res.status(201).json({ message: 'Registrasi berhasil' });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Username/password salah' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Username/password salah' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, nama: user.nama } });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

module.exports = { register, login };
