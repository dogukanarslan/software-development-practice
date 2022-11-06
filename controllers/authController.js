const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // Duplicate error code
  if (err.code === 11000) {
    errors.email = 'Email already exists';

    return errors;
  }

  // Validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// 3 days expiration time
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', { expiresIn: maxAge });
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });

    const token = createToken(user._id);

    res.cookie('authentication', token, { maxAge: maxAge * 1000 });
    res.status(201).json({user: user._id});
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.login_post = (req, res) => {
  const { email, password } = req.body;

  try {
    res.status(200).json({ email, password });
  } catch (err) {
    console.error(err);
    res.status(400).send('Login failed');
  }
};
