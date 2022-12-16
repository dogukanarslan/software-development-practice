const jwt = require('jsonwebtoken');
const Pin = require('../models/Pin');
const User = require('../models/User');
const { decodeToken } = require('../utils');
module.exports.list_get = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const searchData = req.query['search-data'];

  const pins = await Pin.find({ user_id: decodedToken.id })
    .where('user_id')
    .equals(decodedToken.id)
    .where('title')
    .where('description')
    .regex(new RegExp(searchData, 'i'));

  res.render('listPins', {
    pins,
    pathname: req.path,
  });
};

module.exports.show_get = async (req, res) => {
  const pin = await Pin.findOne({ _id: req.params.pinId });
  const token = req.cookies.authentication;

  const decodedToken = decodeToken(token);

  const likedUsers = await User.find({
    _id: { $in: pin.liked_by },
  });

  const dislikedUsers = await User.find({
    _id: { $in: pin.disliked_by },
  });

  const isLiked = pin.liked_by?.some((userId) => userId === decodedToken.id);
  const isDisliked = pin.disliked_by?.some(
    (userId) => userId === decodedToken.id
  );

  res.render('showPin', {
    pin,
    liked_users: likedUsers,
    disliked_users: dislikedUsers,
    isLiked,
    isDisliked,
    pathname: req.url,
  });
};

module.exports.like_pin = async (req, res) => {
  const { pinId, field } = req.body;
  const token = req.cookies.authentication;
  const pin = await Pin.findOne({ _id: pinId });

  if (pin) {
    const decodedToken = decodeToken(token);
    if (pin.liked_by.some((userId) => userId === decodedToken.id)) {
      pin.liked_by = pin.liked_by.filter(
        (userId) => userId !== decodedToken.id
      );
    } else {
      pin.liked_by.push(decodedToken.id);
    }

    // Check if post is currently disliked
    if (pin.disliked_by.some((userId) => userId === decodedToken.id)) {
      pin.disliked_by = pin.disliked_by.filter(
        (userId) => userId !== decodedToken.id
      );
    }

    const likedUsers = await User.find({
      _id: { $in: pin.liked_by },
    });

    const dislikedUsers = await User.find({
      _id: { $in: pin.disliked_by },
    });

    pin.save();
    res.status(200).json({
      liked_by: pin.liked_by,
      disliked_by: pin.disliked_by,
      liked_users: likedUsers,
      disliked_users: dislikedUsers,
    });
  } else {
    res.status(400).send('Pin does not exist');
  }
};

module.exports.dislike_pin = async (req, res) => {
  const { pinId } = req.body;
  const token = req.cookies.authentication;
  const pin = await Pin.findOne({ _id: pinId });

  if (pin) {
    const decodedToken = decodeToken(token);
    if (pin.disliked_by.some((userId) => userId === decodedToken.id)) {
      pin.disliked_by = pin.disliked_by.filter(
        (userId) => userId !== decodedToken.id
      );
    } else {
      pin.disliked_by.push(decodedToken.id);
    }

    // Check if post is currently liked
    if (pin.disliked_by.some((userId) => userId === decodedToken.id)) {
      pin.liked_by = pin.liked_by.filter(
        (userId) => userId !== decodedToken.id
      );
    }

    const likedUsers = await User.find({
      _id: { $in: pin.liked_by },
    });

    const dislikedUsers = await User.find({
      _id: { $in: pin.disliked_by },
    });

    pin.save();
    res.status(200).json({
      disliked_by: pin.disliked_by,
      liked_by: pin.liked_by,
      liked_users: likedUsers,
      disliked_users: dislikedUsers,
    });
  } else {
    res.status(400).send('Pin does not exist');
  }
};

module.exports.create_get = (req, res) => {
  res.render('createPin', { pathname: req.url });
};

module.exports.create_post = async (req, res) => {
  const { title, description, link } = req.body;

  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

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
