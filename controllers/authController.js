const User = require('../models/User');

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).send('Signup failed');
  }
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
