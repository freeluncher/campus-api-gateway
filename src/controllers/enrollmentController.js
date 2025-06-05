const Enrollment = require('../models/enrollment');
const Course = require('../models/course');
const { body, validationResult } = require('express-validator');

const validateEnrollment = [
    body('course').isMongoId().withMessage('Course must be a valid ObjectId'),
];

// Mahasiswa memilih matkul (enroll)
const enrollCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { course } = req.body;
        const student = req.user.id;
        // Ambil data course
        const courseData = await Course.findById(course);
        if (!courseData) return res.status(404).json({ error: 'Course not found' });
        // Cek duplikat
        const exist = await Enrollment.findOne({ student, course, academicYear: courseData.academicYear, semester: courseData.semester });
        if (exist) return res.status(400).json({ error: 'Already enrolled in this course' });
        const data = new Enrollment({ student, course, lecturer: courseData.lecturer, academicYear: courseData.academicYear, semester: courseData.semester });
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Dosen/mahasiswa/admin melihat daftar enroll
const getEnrollments = async (req, res) => {
    try {
        const filter = {};
        if (req.query.student) filter.student = req.query.student;
        if (req.query.lecturer) filter.lecturer = req.query.lecturer;
        if (req.query.course) filter.course = req.query.course;
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        if (req.query.semester) filter.semester = req.query.semester;
        const data = await Enrollment.find(filter).populate('student lecturer');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { enrollCourse, getEnrollments, validateEnrollment };
