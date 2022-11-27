const { app } = require('./');
const mongoose = require('mongoose');

// Database connection
dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
