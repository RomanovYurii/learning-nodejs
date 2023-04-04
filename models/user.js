const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cart: {
      items: [
        {
          count: {
            type: Number,
            required: true,
            default: 1,
          },
          courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
          },
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

userSchema.method('addToCart', function (course) {
  const _items = [...this.cart.items];
  const courseIdx = _items.findIndex(
    (c) => c.courseId.toString() === course._id.toString()
  );

  if (courseIdx >= 0) {
    const _course = _items[courseIdx];
    _items[courseIdx].count = _course.count + 1;
  } else {
    _items.push({
      courseId: course._id,
      count: 1,
    });
  }

  this.cart = { ...this.cart, items: _items };
  return this.save();
});

module.exports = model('User', userSchema);
