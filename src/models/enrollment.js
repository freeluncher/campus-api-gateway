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
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
