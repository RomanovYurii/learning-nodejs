const { Router } = require('express');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const User = require('../../models/user');
const resetPasswordEmail = require('../../emails/resetPassword');

const router = Router();

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', (req, res) => {
  res.render('auth/reset', {
    title: 'Forgot your password?',
    error: req.flash('error'),
  });
});

router.post('/', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buf) => {
      if (err) {
        req.flash('error', 'Something went wrong. Try again later.');
        return res.redirect('/auth/reset');
      }

      const token = buf.toString('hex');

      const candidate = await User.findOne({ email: req.body.email });
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await sgMail.send(resetPasswordEmail(candidate.email, token));
        res.redirect('/auth/login');
      } else {
        req.flash('error', 'No user found with given email.');
        return res.redirect('/auth/reset');
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
