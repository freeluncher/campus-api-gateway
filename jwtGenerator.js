// Jalankan: node jwtGenerator.js
// Akan menghasilkan JWT_SECRET random yang aman untuk .env

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET yang dihasilkan:\n');
console.log(secret);
console.log('\nCopy dan tempelkan ke file .env Anda, misal:');
console.log(`JWT_SECRET=${secret}`);