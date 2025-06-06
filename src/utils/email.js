const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.ETHEREAL_EMAIL,
    pass: process.env.ETHEREAL_PASSWORD
  }
});

async function sendEmail(to, subject, html) {
  return transporter.sendMail({
    from: process.env.ETHEREAL_EMAIL,
    to,
    subject,
    html
  });
}

module.exports = { sendEmail };
