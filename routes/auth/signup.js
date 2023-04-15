const { Router } = require('express');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

const signupEmail = require('../../emails/signup');
const User = require('../../models/user');
const { signupValidators } = require('../../utils/validators');
const { validationResult } = require('express-validator');

const router = Router();

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', signupValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('signupError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#signup');
    }

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
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
