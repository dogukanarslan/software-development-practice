require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const Pin = require('./models/Pin');
const authRoutes = require('./routes/authRoutes');
const pinRoutes = require('./routes/pinRoutes');
const cookieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');

// Routes
app.get('*', checkUser);
app.get('/', requireAuth, async (req, res) => {
  const pins = await Pin.find();
  res.render('home', { pins });
});

app.use(authRoutes);
app.use(pinRoutes);

module.exports.app = app;
