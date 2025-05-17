const nodemailer = require('nodemailer');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendLoginEmail = async (to, username) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sustainability Tracker" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Login Notification',
      html: `<p>Hello <b>${username}</b>,<br>Your account was just logged in.<br>If this wasn't you, please secure your account.</p>`,
    });

    console.log('📧 Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};

module.exports = { sendLoginEmail };
