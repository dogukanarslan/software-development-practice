const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Pin = require('./Pin');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, "Password can't be shorter than 6 characters."],
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Static methods of User model
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }

    throw Error('Incorrect password.');
  }

  throw Error('Incorrect email.');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
