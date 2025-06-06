const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware: check JWT
const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token not found', code: 'TOKEN_NOT_FOUND' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }
};

// Middleware: check role
const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied', code: 'ACCESS_DENIED' });
    }
    next();
};

module.exports = { authenticate, authorize };
