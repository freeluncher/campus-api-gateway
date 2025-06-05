const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    lecturers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
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

module.exports = mongoose.model('Course', CourseSchema);
