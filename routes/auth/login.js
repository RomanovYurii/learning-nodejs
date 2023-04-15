const { Router } = require('express');

const User = require('../../models/user');
const { validationResult } = require('express-validator');
const { loginValidators } = require('../../utils/validators');

const router = Router();

router.get('/', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorisation',
    isLogin: true,
    loginError: req.flash('loginError'),
    signupError: req.flash('signupError'),
  });
});

router.post('/', loginValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#login');
    }

    req.session.user = await User.findOne({ email: req.body.email });
    req.session.isAuthenticated = true;
    req.session.save((err) => {
      if (err) {
        throw err;
      }

      res.redirect('/');
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
