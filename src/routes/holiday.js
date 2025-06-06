const express = require('express');
const router = express.Router();
const Holiday = require('../models/holiday');
const { authenticate, authorize } = require('../controllers/authMiddleware');
const { body, validationResult } = require('express-validator');

// Validation
const validateHoliday = [
  body('date').isISO8601().withMessage('Date must be in ISO8601 format (YYYY-MM-DD)'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

// GET /api/holiday - list all holidays
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
});

// POST /api/holiday - create holiday
router.post('/', authenticate, authorize('admin'), validateHoliday, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { date, description } = req.body;
    const exist = await Holiday.findOne({ date });
    if (exist) return res.status(400).json({ error: 'Holiday already exists for this date' });
    const holiday = new Holiday({ date, description });
    await holiday.save();
    res.status(201).json(holiday);
  } catch (err) {
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
});

// PUT /api/holiday/:id - update holiday
router.put('/:id', authenticate, authorize('admin'), validateHoliday, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { date, description } = req.body;
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.id,
      { date, description },
      { new: true, runValidators: true }
    );
    if (!holiday) return res.status(404).json({ error: 'Holiday not found' });
    res.json(holiday);
  } catch (err) {
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
});

// DELETE /api/holiday/:id - delete holiday
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) return res.status(404).json({ error: 'Holiday not found' });
    res.json({ message: 'Holiday deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', code: 'SERVER_ERROR' });
  }
});

module.exports = router;
