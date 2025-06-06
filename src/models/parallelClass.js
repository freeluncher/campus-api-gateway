const mongoose = require('mongoose');

const ParallelClassSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
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

module.exports = mongoose.model('ParallelClass', ParallelClassSchema);