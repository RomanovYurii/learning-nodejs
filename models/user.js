const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: String,
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
    avatarUrl: String,
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
  const items = [...this.cart.items];
  const courseIdx = items.findIndex(
    (c) => c.courseId.toString() === course._id.toString()
  );

  if (courseIdx >= 0) {
    const _course = items[courseIdx];
    items[courseIdx].count = _course.count + 1;
  } else {
    items.push({
      courseId: course._id,
      count: 1,
    });
  }

  this.cart = { items };
  return this.save();
});

userSchema.method('removeFromCartById', function (id) {
  const items = [...this.cart.items];
  const courseIdx = items.findIndex(
    (c) => c.courseId.toString() === id.toString()
  );

  if (courseIdx >= 0) {
    if (items[courseIdx].count === 1) {
      items.splice(courseIdx, 1);
    } else {
      items[courseIdx].count--;
    }
  }

  this.cart = { items };
  return this.save();
});

userSchema.method('clearCart', function () {
  this.cart = { items: [] };
  this.save();
});

module.exports = model('User', userSchema);
