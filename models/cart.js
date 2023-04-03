const path = require('path');
const fs = require('fs');

const PATH = path.join(__dirname, '..', 'data', 'cart.json');

class Cart {
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

    return new Promise((resolve, reject) => {
      fs.writeFile(PATH, JSON.stringify(cart), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
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
}

module.exports = Cart;
