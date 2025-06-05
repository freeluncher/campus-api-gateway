const mongoose = require('mongoose');

const PresensiSchema = new mongoose.Schema({
    mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
