const { Router } = require('express');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

const signupEmail = require('../../emails/signup');
const User = require('../../models/user');

const router = Router();

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', async (req, res) => {
  try {
    // ToDo: validate password == confirm
    const { email, password, confirm, name } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('signupError', 'User with this email already exists');
      res.redirect('/auth/login#signup');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });
      await user.save();
      sgMail
        .send(signupEmail(email))
        .then(() => res.redirect('/auth/login#login'));
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;