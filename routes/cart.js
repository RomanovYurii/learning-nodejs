const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

const mapCartItemsFromUser = (user) =>
  user.cart.items.map((c) => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));

const computeCartTotal = (courses) =>
  courses.reduce((total, course) => total + course.count * course.price, 0);

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id).lean();
  req.user.addToCart(course);
  res.redirect('/cart');
});

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.courseId');
  const courses = mapCartItemsFromUser(user);
  const price = computeCartTotal(courses);

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: courses,
    price,
  });
});

router.delete('/:id', async (req, res) => {
  await req.user.removeFromCartById(req.params.id);
  const user = await req.user.populate('cart.items.courseId');

  const courses = mapCartItemsFromUser(user);
  const cart = {
    courses,
    price: computeCartTotal(courses),
  };

  res.status(200).json(cart);
});

module.exports = router;
