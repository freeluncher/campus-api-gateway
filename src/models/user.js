const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'lecturer', 'admin'],
        default: 'student',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    permissions: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
