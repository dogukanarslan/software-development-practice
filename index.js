require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const pinRoutes = require('./routes/pinRoutes');
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');

// Routes
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.render('home');
});

app.use(authRoutes);
app.use(pinRoutes);

module.exports.app = app;
