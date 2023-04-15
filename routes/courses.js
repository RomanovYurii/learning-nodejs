const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('authorId', 'email name').lean();

  res.render('courses', {
    title: 'Courses',
    isCourses: true,
    courses,
  });
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  const course = await Course.findById(req.params.id).lean();
  res.render('course-edit', {
    title: `Edit course ${course.title}`,
    course,
  });
});

router.post('/edit', auth, async (req, res) => {
  const { id } = req.body;
  delete req.body.id; // To avoid adding unnecessary id field, as MDB ads it by _id

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    await Course.findByIdAndUpdate(id, req.body);
  }
  res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
  Course.deleteOne({
    _id: req.body.id,
  })
    .then(() => {
      res.redirect('/courses');
    })
    .catch((err) => console.log(err));
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).lean();

  res.render('course', {
    layout: 'empty',
    title: `Course name: ${course.title}`,
    course,
  });
});

module.exports = router;
