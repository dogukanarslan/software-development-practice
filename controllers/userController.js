const User = require('../models/User');
const { decodeToken } = require('../utils');

module.exports.list_get = async (req, res) => {
  const searchData = req.query['search-data'];

  const users = await User.find({
    $or: [
      { name: new RegExp(searchData, 'i') },
      { surname: new RegExp(searchData, 'i') },
    ],
  }).sort({ created_at: -1 });

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
    currentUser
      .updateOne({
        following: currentUser.following.filter(
          (userId) => userId !== req.params.userId
        ),
      })
      .exec();
    targetUser
      .updateOne({
        followed_by: targetUser.followed_by.filter(
          (userId) => userId !== decodedToken.id
        ),
      })
      .exec();
  } else {
    currentUser
      .updateOne({
        following: [...currentUser.following, req.params.userId],
      })
      .exec();
    targetUser
      .updateOne({
        followed_by: [...targetUser.followed_by, decodedToken.id],
      })
      .exec();
  }

  res.redirect(`/users/${targetUser.id}`);
};
