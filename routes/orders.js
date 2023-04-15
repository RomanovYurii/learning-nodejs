const { Router } = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    let orders = await Order.find({
      'user.userId': req.user._id,
    }).populate('user.userId');

    orders = orders.map((order) => {
      const _order = {};
      _order.id = order.id;
      _order.date = order.date;
      _order.user = {
        name: order.user.name,
        email: order.user.userId.email,
      };
      _order.courses = order.courses.map((cart) => ({
        count: cart.count,
        title: cart.course.title,
      }));
      _order.price = order.courses.reduce(
        (total, cart) => total + cart.count * cart.course.price,
        0
      );
      return _order;
    });

    res.render('orders', {
      isOrder: true,
      title: 'Orders',
      orders,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseId');

    const courses = user.cart.items.map((i) => ({
      course: { ...i.courseId._doc },
      count: i.count,
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
