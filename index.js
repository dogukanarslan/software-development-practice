require('dotenv').config();
const path = require('path');
const express = require('express');
const Pin = require('./models/Pin');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pinRoutes = require('./routes/pinRoutes');
const todoRoutes = require('./routes/todoRoutes');
const cookieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middlewares/authMiddleware');
const { decodeToken } = require('./utils');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  '/js',
  express.static(
    path.join(
      __dirname,
      'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    )
  )
);

// View engine
app.set('view engine', 'ejs');

// Routes
app.get('*', checkUser);
app.get('/', requireAuth, async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const searchData = req.query['search-data'];
  const type = req.query['type'] || 'all';

  let pins = await Pin.find({
    $or: [
      { title: new RegExp(searchData, 'i') },
      { description: new RegExp(searchData, 'i') },
    ],
  })
  .sort({ created_at: -1 });

  if (type === 'following') {
    const user = await User.findOne({ _id: decodedToken.id });
    pins = pins.filter((pin) => user.following.includes(pin.user_id));
  }

  res.render('home', {
    pins,
    type,
    pathname: req.path,
  });
});

app.use(authRoutes);
app.use(userRoutes);
app.use(pinRoutes);
app.use(todoRoutes);

module.exports.app = app;
