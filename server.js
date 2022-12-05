const { app } = require('./');
const mongoose = require('mongoose');
const PORT = process.env.port || 3000;

// Database connection
dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));
