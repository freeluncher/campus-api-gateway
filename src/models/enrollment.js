const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matkul: {
        type: String,
        required: true
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

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
