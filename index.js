require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');

// Database connection
dbURI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.b9onbdw.mongodb.net/${process.env.DB}`;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// Routes
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/pins', requireAuth, (req, res) => {
  res.render('pins', {
    pins: [
      { title: 'Document 1', description: 'Lorem ipsum' },
      { title: 'Document 2', description: 'Lorem ipsum' },
      { title: 'Document 3', description: 'Lorem ipsum' },
      { title: 'Document 4', description: 'Lorem ipsum' },
    ],
  });
});
app.use(authRoutes);
