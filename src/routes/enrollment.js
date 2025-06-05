const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrollments, validateEnrollment } = require('../controllers/enrollmentController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// Student enrolls course
router.post('/', authenticate, authorize('student'), validateEnrollment, enrollCourse);
// All users can view enrollments (can be filtered via query)
router.get('/', authenticate, getEnrollments);

module.exports = router;
