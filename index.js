const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.listen(3000)

app.set('view engine', 'ejs');

app.use(express.json())

app.use(authRoutes);
