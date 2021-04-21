const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
require('dotenv/config');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  last_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, email: this.email },
    config.get('jwtPrivateKey'),
    { expiresIn: '4h' }
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
