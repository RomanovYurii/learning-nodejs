const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id).lean();
  req.user.addToCart(course);
  res.redirect('/cart');
});

router.get('/', async (req, res) => {
  const cart = await Cart.fetch();
  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: cart.courses,
    price: cart.price,
  });
});

router.delete('/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id);
  res.status(200).json(cart);
});

module.exports = router;
