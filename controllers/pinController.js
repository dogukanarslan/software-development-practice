const jwt = require('jsonwebtoken');
const Pin = require('../models/Pin');
const User = require('../models/User');

module.exports.list_get = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = jwt.verify(token, 'secret');

  const pins = await Pin.find({ user_id: decodedToken.id });

  res.render('listPins', {
    pins,
  });
};

module.exports.show_get = async (req, res) => {
  const pin = await Pin.findOne({ _id: req.params.pinId });

  res.render('showPin', { pin });
};

module.exports.create_get = (req, res) => {
  res.render('createPin');
};

module.exports.create_post = async (req, res) => {
  const { title, description, link } = req.body;

  const token = req.cookies.authentication;
  const decodedToken = jwt.verify(token, 'secret');

  const user = await User.findOne({ _id: decodedToken.id });

  try {
    const pin = await Pin.create({
      title,
      description,
      link,
      user_id: user._id,
      creator: user.name + ' ' + user.surname,
    });

    res.status(200).json({ pin: pin._id });
  } catch (err) {
    let errors = { title: '', description: '', link: '' };

    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });

    res.status(400).json({ errors });
  }
};
