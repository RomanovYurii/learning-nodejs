require('dotenv').config();

module.exports = (to, token) => ({
  to,
  from: process.env.EMAIL_FROM,
  subject: 'Reset password',
  html: `
      <h1>Forgot your password?</h1>
      <p>Please, ignore this email if you didn't request this action.</p>
      <p>If you want to reset your password, please follow the next link:</p>
      <p><a href="${process.env.BASE_URL}/auth/password/${token}">Reset your password</a></p>
      <hr>
      <p><a href="${process.env.BASE_URL}">Learning NodeJS</a></p>
    `,
});
