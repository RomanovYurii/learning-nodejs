const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorisation',
    isLogin: true,
  });
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.post('/login', async (req, res) => {
  req.session.user = await User.findById('642c45e69ead8026ab508385');
  req.session.isAuthenticated = true;
  req.session.save((err) => {
    if (err) {
      throw err;
    }

    res.redirect('/');
  });
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirm, name } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      res.redirect('/auth/login#register');
    } else {
      const user = new User({
        email,
        name,
        password,
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
