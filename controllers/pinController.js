const Pin = require('../models/Pin');

module.exports.list_get = async (req, res) => {
  const pins = await Pin.find();

  res.render('listPins', {
    pins,
  });
};

module.exports.create_get = (req, res) => {
  res.render('createPin');
};

module.exports.create_post = async (req, res) => {
  const { title, description, link } = req.body;

  try {
    const pin = await Pin.create({ title, description, link });

    res.status(200).json({ pin: pin._id });
  } catch (err) {
    let errors = { title: '', description: '', link: '' };

    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });

    res.status(400).json({ errors });
  }
};
