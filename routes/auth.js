const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorisation',
    isLogin: true,
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

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
