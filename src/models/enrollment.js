const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
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
    academicYear: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        enum: ['odd', 'even'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'dropped'],
        default: 'active',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
