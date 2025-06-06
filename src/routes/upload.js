const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// Setup multer for proof upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/attendance');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    // Only allow image/pdf
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg|gif)$/) && file.mimetype !== 'application/pdf') {
      return cb(new Error('Only image or PDF files are allowed!'));
    }
    cb(null, true);
  }
});

// POST /api/upload/proof
router.post('/proof', authenticate, authorize('student'), upload.single('proof'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return relative path for attendance proof
  const proofPath = `/uploads/attendance/${req.file.filename}`;
  res.status(201).json({ message: 'File uploaded', path: proofPath });
});

module.exports = router;
