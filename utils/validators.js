const { body } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.signupValidators = [
  body('email')
    .isEmail()
    .withMessage('Provided email is incorrect')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('User with this email already exists');
        }
      } catch (e) {
        console.log(e);
      }
    }),
  body('password', 'Password should be at least 8 character long')
    .isLength({ min: 8, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords should match');
      }
      return true;
    })
    .trim(),
  body('name', 'Name should have at least 2 letters')
    .isLength({ min: 2 })
    .trim(),
];

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Provided email is incorrect')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject('User with this email does not exist');
        }
      } catch (e) {
        console.log(e);
      }
    }),
  body('password').custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      const passwordsMatch = await bcrypt.compare(value, user.password);
      if (!passwordsMatch) {
        return Promise.reject('Wrong password provided');
      }
    } catch (e) {
      console.log(e);
    }
  }),
];
