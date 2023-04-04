const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { connect } = require('mongoose');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRouters = require('./routes/cart');

const User = require('./models/user');

require('dotenv').config();
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    req.user = await User.findById('642c45e69ead8026ab508385');
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRouters);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
    });

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'ranoveria@gmail.com',
        name: 'Yurii',
        cart: { items: [] },
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server started on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
