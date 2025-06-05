const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrollments, validateEnrollment, dropCourse } = require('../controllers/enrollmentController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// Student enrolls course
router.post('/', authenticate, authorize('student'), validateEnrollment, enrollCourse);
// Student drops a course
router.post('/drop', authenticate, authorize('student'), async (req, res) => {
    return dropCourse(req, res);
});
// All users can view enrollments (can be filtered via query)
router.get('/', authenticate, getEnrollments);

module.exports = router;
