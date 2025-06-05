const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    judul: {
        type: String,
        required: true,
        trim: true
    },
    deskripsi: {
        type: String,
        required: true,
        trim: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['belum', 'proses', 'selesai'],
        default: 'belum',
        required: true
    },
    mahasiswa: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
