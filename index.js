require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

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

app.use(express.json());

app.use(authRoutes);
