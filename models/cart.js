const path = require('path');
const fs = require('fs');

const PATH = path.join(__dirname, '..', 'data', 'cart.json');

class Cart {
  static async writeCart(cart) {
    return new Promise((resolve, reject) => {
      fs.writeFile(PATH, JSON.stringify(cart), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static async add(course) {
    const cart = await Cart.fetch();

    const idx = cart.courses.findIndex((c) => c.id === course.id);
    const candidate = cart.courses[idx];

    if (candidate) {
      // course exists
      candidate.count += 1;
      cart.courses[idx] = candidate;
    } else {
      // need to add
      course.count = 1;
      cart.courses.push(course);
    }

    cart.price += +course.price;
    return await Cart.writeCart(cart);
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(PATH, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  static async remove(id) {
    const cart = await Cart.fetch();

    const courseIdx = cart.courses.findIndex((c) => c.id === id);
    const course = cart.courses[courseIdx];

    if (course.count === 1) {
      // delete
      cart.courses.splice(courseIdx, 1);
    } else {
      // decrement
      cart.courses[courseIdx].count--;
    }

    cart.price -= course.price;
    await Cart.writeCart(cart);
    return cart;
  }
}

module.exports = Cart;
