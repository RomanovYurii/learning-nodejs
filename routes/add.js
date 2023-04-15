const { Router } = require('express');
const { validationResult } = require('express-validator');

const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add new course',
    isAdd: true,
  });
});

router.post('/', courseValidators, auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add new course',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      }
    });
  }

  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    authorId: req.user,
  });

  try {
    await course.save();
  } catch (err) {
    console.error(err);
  }

  res.redirect('/courses');
});

module.exports = router;
