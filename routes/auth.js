const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorisation',
    isLogin: true,
    loginError: req.flash('loginError'),
    signupError: req.flash('signupError'),
  });
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });
    if (candidate) {
      const passwordsMatch = await bcrypt.compare(password, candidate.password);

      if (passwordsMatch) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }

          res.redirect('/');
        });
      } else {
        req.flash('loginError', 'Password is incorrect');
        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('loginError', 'No user found with this email');
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/signup', async (req, res) => {
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
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
