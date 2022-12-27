const Todo = require('../models/Todo');
const User = require('../models/User');
const { decodeToken } = require('../utils');

module.exports.list_get = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const searchData = req.query['search-data'];

  const todos = await Todo.find({
    $or: [
      { title: new RegExp(searchData, 'i') },
      { description: new RegExp(searchData, 'i') },
    ],
  })
    .where('user_id')
    .equals(decodedToken.id)
    .sort({ created_at: -1 });

  res.render('listTodos', {
    todos,
    pathname: req.path,
  });
};

module.exports.show_get = async (req, res) => {
  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const todo = await Todo.findOne({ _id: req.params.todoId });

  res.render('showTodo', {
    todo,
    pathname: req.url,
  });
};

module.exports.create_post = async (req, res) => {
  const { title, description, link, pinId, pinTitle } = req.body;

  const token = req.cookies.authentication;
  const decodedToken = decodeToken(token);

  const user = await User.findOne({ _id: decodedToken.id });

  const todo = await Todo.create({
    title,
    pin_title: pinTitle,
    description,
    link,
    creator: user.name + ' ' + user.surname,
    pin_id: pinId,
    user_id: decodedToken.id,
  });

  res.redirect(`/pins/${pinId}`);
};

module.exports.delete = async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.deleteOne({ _id: todoId });

  res.redirect('/todos');
};
