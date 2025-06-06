const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const register = async (req, res) => {
    try {
        const { username, password, name } = req.body;
        // Force role to 'student' for all public registration
        const role = 'student';
        // Default permissions for student
        const permissions = [
            'enrollment:create',
            'enrollment:read',
            'enrollment:drop',
            'attendance:create',
            'attendance:read',
            // Tambahkan permission lain jika perlu
        ];
        if (!username || !password || !name) {
            return res.status(400).json({ error: 'All fields are required', code: 'FIELDS_REQUIRED' });
        }
        const exist = await User.findOne({ username });
        if (exist) return res.status(400).json({ error: 'Username already exists', code: 'USERNAME_EXISTS' });
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed, role, name, permissions });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'All fields are required', code: 'FIELDS_REQUIRED' });
        }
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid username/password', code: 'INVALID_CREDENTIALS' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid username/password', code: 'INVALID_CREDENTIALS' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', code: 'SERVER_ERROR' });
    }
};

module.exports = { register, login };
