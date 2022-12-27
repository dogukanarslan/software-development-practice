const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.authentication;

  // Check JWT existence
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.authentication;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.currentUser = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.currentUser = user;
        next();
      }
    });
  } else {
    res.locals.currentUser = null;
    next();
  }
};

module.exports.requireAuth = requireAuth;
module.exports.checkUser = checkUser;
