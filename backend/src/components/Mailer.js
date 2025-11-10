    const nodemailer = require('nodemailer');
    const path = require('path');
    require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

    // Import both email template functions
    const { generateWelcomeEmailHtml, generateLoginEmailHtml } = require('../utils/emailTemplates');

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    /**
     * Sends a login notification email to the user.
     * @param {string} to - The recipient's email address.
     * @param {string} username - The username of the logged-in user.
     * @param {Date} [loginTime] - Optional: The time of login (defaults to now if not provided).
     */
    const sendLoginEmail = async (to, username, loginTime = new Date()) => { // <--- ADDED loginTime PARAMETER
      try {
        const loginHtml = generateLoginEmailHtml(username, loginTime); // <--- USE NEW TEMPLATE FUNCTION

        const info = await transporter.sendMail({
          from: `"Sustainability Tracker" <${process.env.MAIL_USER}>`,
          to,
          subject: 'Login Notification - Personal Sustainability Tracker', // <--- UPDATED SUBJECT
          html: loginHtml, // <--- USE GENERATED HTML
        });

        console.log('📧 Login email sent:', info.messageId);
      } catch (error) {
        console.error('❌ Failed to send login email:', error);
      }
    };

    /**
     * Sends a welcome email to a newly registered user.
     * @param {string} to - The recipient's email address.
     * @param {string} username - The username of the new user.
     */
    const sendWelcomeEmail = async (to, username) => {
      try {
        const welcomeHtml = generateWelcomeEmailHtml(username);

        const info = await transporter.sendMail({
          from: `"Sustainability Tracker" <${process.env.MAIL_USER}>`,
          to,
          subject: 'Welcome to Personal Sustainability Tracker! 🌱',
          html: welcomeHtml,
        });

        console.log('📧 Welcome email sent:', info.messageId);
      } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
      }
    };

    module.exports = {
      sendLoginEmail,
      sendWelcomeEmail,
    };
    