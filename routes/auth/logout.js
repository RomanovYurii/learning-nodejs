const { Router } = require('express');
const router = Router();
router.get('/', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;