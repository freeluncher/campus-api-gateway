// Seed some example holidays (run once, then delete or comment out)
const mongoose = require('mongoose');
require('dotenv').config();
const Holiday = require('./src/models/holiday');

const holidays = [
  { date: new Date('2025-06-01'), description: 'National Holiday Example' },
  { date: new Date('2025-12-25'), description: 'Christmas Day' },
  { date: new Date('2025-01-01'), description: 'New Year' }
];

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  await Holiday.deleteMany({});
  await Holiday.insertMany(holidays);
  console.log('Holidays seeded!');
  process.exit();
});
