const mongoose = require('mongoose');

const PresensiSchema = new mongoose.Schema({
    mahasiswa: {
        type: String,
        required: true,
        trim: true
    },
    tanggal: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['hadir', 'izin', 'sakit', 'alpa'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Presensi', PresensiSchema);
