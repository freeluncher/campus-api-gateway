const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
        trim: true
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
