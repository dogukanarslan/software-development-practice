const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      required: [true, 'Link is required.'],
    },
    tag: {
      type: String,
    },
    creator: {
      type: String,
    },
    user_id: {
      type: String,
    },
    liked_by: [String],
    disliked_by: [String],
    saved_by: [String],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Pin = mongoose.model('pin', pinSchema);

module.exports = Pin;
