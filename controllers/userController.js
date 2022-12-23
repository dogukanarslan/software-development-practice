const User = require('../models/User');
const { decodeToken } = require('../utils');

module.exports.list_get = async (req, res) => {
  const token = req.cookies.authentication;

  const searchData = req.query['search-data'];

  const users = await User.find()
    .where('name')
    .where('surname')
    .regex(new RegExp(searchData, 'i'))
    .sort({ created_at: -1 });

  res.render('listUsers', {
    users,
    pathname: req.path,
  });
};

module.exports.show_get = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const user = await User.findOne({ _id: req.params.userId });

  const following = await User.find({
    _id: { $in: user.following },
  });

  const followed = await User.find({
    _id: { $in: user.followed_by },
  });

  res.render('showUser', {
    user,
    following,
    followed,
    isFollowed: user.followed_by.includes(decodedToken.id),
    pathname: req.url,
  });
};

module.exports.follow_user = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const currentUser = await User.findOne({ _id: decodedToken.id });
  const targetUser = await User.findOne({ _id: req.params.userId });

  if (currentUser.following.includes(req.params.userId)) {
    currentUser.following = currentUser.following.filter(
      (userId) => userId !== req.params.userId
    );
    targetUser.followed_by = targetUser.following.filter(
      (userId) => userId !== req.params.id
    );
  } else {
    currentUser.following.push(req.params.userId);
    targetUser.followed_by.push(decodedToken.id);
  }

  currentUser.save();
  targetUser.save();
  res.redirect(`/users/${targetUser.id}`);
};
