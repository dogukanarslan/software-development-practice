const jwt = require('jsonwebtoken');
const Pin = require('../models/Pin');
const User = require('../models/User');
const { decodeToken } = require('../utils');

module.exports.list_get = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const searchData = req.query['search-data'];

  const pins = await Pin.find()
    .where('user_id')
    .equals(decodedToken.id)
    .where('title')
    .where('description')
    .regex(new RegExp(searchData, 'i'))
    .sort({ created_at: -1 });

  res.render('listPins', {
    pins,
    pathname: req.path,
  });
};

module.exports.list_saved_get = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const searchData = req.query['search-data'];

  const pins = await Pin.find()
    .where('saved_by')
    .in(decodedToken.id)
    .where('title')
    .where('description')
    .regex(new RegExp(searchData, 'i'))
    .sort({ created_at: -1 });

  res.render('listSavedPins', {
    pins,
    pathname: req.path,
  });
};

module.exports.show_get = async (req, res) => {
  const pin = await Pin.findOne({ _id: req.params.pinId });
  const token = req.cookies.authentication;

  const decodedToken = decodeToken(token);

  const user = await User.findOne({ _id: pin.user_id });

  const likedUsers = await User.find({
    _id: { $in: pin.liked_by },
  });

  const dislikedUsers = await User.find({
    _id: { $in: pin.disliked_by },
  });

  const savedUsers = await User.find({
    _id: { $in: pin.saved_by },
  });

  const isLiked = pin.liked_by?.some((userId) => userId === decodedToken.id);
  const isDisliked = pin.disliked_by?.some(
    (userId) => userId === decodedToken.id
  );
  const isSaved = pin.saved_by?.some((userId) => userId === decodedToken.id);

  res.render('showPin', {
    pin,
    user,
    liked_users: likedUsers,
    disliked_users: dislikedUsers,
    saved_users: savedUsers,
    isLiked,
    isDisliked,
    isSaved,
    pathname: req.url,
  });
};

module.exports.interact_pin = async (req, res) => {
  const { pinId } = req.params;
  const interact = req.query.interact;

  const token = req.cookies.authentication;
  const pin = await Pin.findOne({ _id: pinId });

  if (pin) {
    const decodedToken = decodeToken(token);

    if (interact === 'like') {
      if (pin.liked_by.some((userId) => userId === decodedToken.id)) {
        pin.liked_by = pin.liked_by.filter(
          (userId) => userId !== decodedToken.id
        );
      } else {
        pin.liked_by.push(decodedToken.id);
      }
    }

    if (interact === 'dislike') {
      if (pin.disliked_by.some((userId) => userId === decodedToken.id)) {
        pin.disliked_by = pin.liked_by.filter(
          (userId) => userId !== decodedToken.id
        );
      } else {
        pin.disliked_by.push(decodedToken.id);
      }
    }

    // Check if post is currently disliked
    if (interact === 'like') {
      if (pin.disliked_by.some((userId) => userId === decodedToken.id)) {
        pin.disliked_by = pin.disliked_by.filter(
          (userId) => userId !== decodedToken.id
        );
      }
    }

    if (interact === 'dislike') {
      if (pin.liked_by.some((userId) => userId === decodedToken.id)) {
        pin.liked_by = pin.liked_by.filter(
          (userId) => userId !== decodedToken.id
        );
      }
    }

    pin.save();
    res.redirect(`/pins/${pin.id}`);
  } else {
    res.status(400).send('Pin does not exist');
  }
};

module.exports.create_get = (req, res) => {
  res.render('createPin', { pathname: req.url });
};

module.exports.create_post = async (req, res) => {
  const { title, description, link, label } = req.body;

  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const user = await User.findOne({ _id: decodedToken.id });

  try {
    const pin = await Pin.create({
      title,
      description,
      link,
      label,
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

module.exports.edit_put = async (req, res) => {
  const { title, description, link } = req.body;
  const { pinId } = req.params;

  try {
    const pin = await Pin.findOneAndUpdate(
      { _id: pinId },
      {
        title,
        description,
        link,
      }
    );

    res.status(200).json({ pin: pin });
  } catch (err) {
    let errors = { title: '', description: '', link: '' };

    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });

    res.status(400).json({ errors });
  }
};

module.exports.save_pin = async (req, res) => {
  const { pinId } = req.params;

  const pin = await Pin.findOne({ _id: pinId });

  if (pin) {
    const token = req.cookies.authentication;
    const decodedToken = decodeToken(token);

    if (pin.saved_by.some((userId) => userId === decodedToken.id)) {
      pin.saved_by = pin.saved_by.filter(
        (userId) => userId !== decodedToken.id
      );
    } else {
      pin.saved_by.push(decodedToken.id);
    }

    pin.save();
    res.redirect(`/pins/${pin.id}`);
  }
};
