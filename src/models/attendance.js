const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'permission', 'sick', 'absent'],
        required: true
    },
    proof: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
