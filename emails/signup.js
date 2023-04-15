require('dotenv').config();

module.exports = (to) => ({
  to,
  from: process.env.EMAIL_FROM,
  subject: 'Sign up successful',
  html: `
      <h1>Welcome to Lorem ipsum dolor sit amet.</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, iusto.</p>
      <span>Your email is ${to}</span>
      <hr>
      <a href="${process.env.BASE_URL}">Main page link</a>
    `,
});
