require('dotenv').config();
const path = require('path');
const express = require('express');
const Pin = require('./models/Pin');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pinRoutes = require('./routes/pinRoutes');
const cookieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
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
  const searchData = req.query['search-data'];

  const pins = await Pin.find()
    .where('title')
    .where('description')
    .regex(new RegExp(searchData, 'i'))
    .sort({ created_at: -1 });

  res.render('home', { pins, pathname: req.path });
});

app.use(authRoutes);
app.use(userRoutes);
app.use(pinRoutes);

module.exports.app = app;
