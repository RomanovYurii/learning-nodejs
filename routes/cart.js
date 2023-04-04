const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id).lean();
  req.user.addToCart(course);
  res.redirect('/cart');
});

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.courseId');

  const courses = user.cart.items.map((c) => ({
    ...c.courseId._doc,
    count: c.count,
  }));

  const price = courses.reduce(
    (total, course) => (total + course.count * course.price),
    0
  );

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: courses,
    price,
  });
});

router.delete('/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id);
  res.status(200).json(cart);
});

module.exports = router;
