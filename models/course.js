const { Schema, model } = require('mongoose');

const course = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = model('Course', course);
