const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
    },
    pin_title: {
      type: String,
      required: [true, 'Pin title required.'],
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      required: [true, 'Link is required.'],
    },
    pin_id: {
      type: String,
      required: [true, 'Pin id is required.'],
    },
    user_id: {
      type: String,
      required: [true, 'User id is required.'],
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;
