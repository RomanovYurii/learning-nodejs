const express = require('express');
const path = require('path');
const cors = require('cors');
const csrf = require('csurf');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const csp = require('express-csp-header');
const MongoStore = require('connect-mongodb-session')(session);
const { connect } = require('mongoose');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const profileRoutes = require('./routes/profile');
const loginRoutes = require('./routes/auth/login');
const logoutRoutes = require('./routes/auth/logout');
const passwordRoutes = require('./routes/auth/password');
const resetRoutes = require('./routes/auth/reset');
const signupRoutes = require('./routes/auth/signup');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const error404Middleware = require('./middleware/error404');
const profilePictureMiddleware = require('./middleware/profilePicture');

require('dotenv').config();

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
});
const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.DB_CONNECTION_STRING,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(profilePictureMiddleware.single('profilePicture'));
app.use(cors());
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(csp({
  policies: {
    'default-src': 'https:',
    'img-src': 'https',
  }
}));
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/profile', profileRoutes);
app.use('/auth/login', loginRoutes);
app.use('/auth/logout', logoutRoutes);
app.use('/auth/password', passwordRoutes);
app.use('/auth/reset', resetRoutes);
app.use('/auth/signup', signupRoutes);
app.use(error404Middleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
    });

    app.listen(PORT, () => {
      console.log(`Server started on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();