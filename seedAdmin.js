// Jalankan: node seedAdmin.js
// Script ini akan membuat user admin pertama secara aman
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user');

const username = 'admin';
const password = 'admin12345'; // Ganti dengan password kuat sebelum produksi
const name = 'Super Admin';
const role = 'admin';

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const exist = await User.findOne({ username });
  if (exist) {
    console.log('Admin user already exists.');
    process.exit();
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, role, name });
  await user.save();
  console.log('Admin user created!');
  console.log('Username:', username);
  console.log('Password:', password);
  process.exit();
}

seedAdmin();
