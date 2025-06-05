const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const register = async (req, res) => {
    try {
        const { username, password, role, name } = req.body;
        if (!username || !password || !role || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const exist = await User.findOne({ username });
        if (exist) return res.status(400).json({ error: 'Username already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed, role, name });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid username/password' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid username/password' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

module.exports = { register, login };
