const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    matkul: {
        type: String,
        required: true,
        trim: true
    },
    dosen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ruang: {
        type: String,
        required: true,
        trim: true
    },
    hari: {
        type: String,
        required: true,
        enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    },
    jamMulai: {
        type: String,
        required: true
    },
    jamSelesai: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
