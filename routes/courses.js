const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();
const { courseValidators } = require('../utils/validators');
const { validationResult } = require('express-validator');

const isOwner = (authorId, currentUserId) =>
  authorId.toString() === currentUserId.toString();
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('authorId', 'email name')
      .lean();

    res.render('courses', {
      title: 'Courses',
      isCourses: true,
      courses,
      currentUserId: req.user?._id.toString() ?? null,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  try {
    const course = await Course.findById(req.params.id).lean();

    if (!isOwner(course.authorId, req.user._id)) {
      return res.redirect('/courses');
    }

    res.render('course-edit', {
      title: `Edit course ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/edit', auth, courseValidators, async (req, res) => {
  try {
    const { id } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
    }
    const course = await Course.findById(id).lean();

    if (!isOwner(course.authorId, req.user._id)) {
      return res.redirect('/courses');
    }

    delete req.body.id; // To avoid adding unnecessary id field, as MDB ads it by _id

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await Course.findByIdAndUpdate(id, req.body);
    }
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', auth, async (req, res) => {
  Course.deleteOne({
    _id: req.body.id,
    authorId: req.user._id,
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
