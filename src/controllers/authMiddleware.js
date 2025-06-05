const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware: cek JWT
const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token tidak ditemukan' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token tidak valid' });
    }
};

// Middleware: cek role
const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Akses ditolak' });
    }
    next();
};

module.exports = { authenticate, authorize };
