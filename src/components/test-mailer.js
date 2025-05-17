// test-email.js
const { sendLoginEmail } = require('./Mailer');
require('dotenv').config();
sendLoginEmail('aswinmsc123@gmail.com', 'Aswin')
  .then(() => console.log('Test email sent!'))
  .catch(console.error);
