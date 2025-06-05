require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { json, urlencoded } = require('express');

const app = express();
app.use(cors());
app.use(helmet());
app.use(json({ limit: '10kb' })); // batasi body max 10kb
app.use(urlencoded({ extended: true, limit: '10kb' }));

// Routes
const presensiRoutes = require('./routes/presence');
app.use('/api/presensi', presensiRoutes);

const scheduleRoutes = require('./routes/schedule');
app.use('/api/jadwal', scheduleRoutes);

const taskRoutes = require('./routes/task');
app.use('/api/tugas', taskRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
