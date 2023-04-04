const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add new course',
    isAdd: true,
  });
});

router.post('/', async (req, res) => {
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