const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    dosen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tahunAjaran: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        enum: ['ganjil', 'genap'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
