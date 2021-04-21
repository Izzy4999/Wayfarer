const { User, validate } = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');
  res.json({ status: 'sucess', statusCode: 200, data: user });
});

router.get('/', [auth, admin], async (req, res) => {
  const user = await User.find().select('-password -__v').sort('first_name');
  res.json({ status: 'sucess', statusCode: 200, data: user });
});

router.post('/sign-up', async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: error.details[0].message,
    });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: 'User already registered.',
    });

  user = new User(
    _.pick(req.body, [
      'first_name',
      'email',
      'password',
      'last_name',
      'isAdmin',
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).json({
    status: 'success',
    statusCode: 200,
    data: {
      token: token,
      userDetails: _.pick(user, [
        'first_name',
        'last_name',
        'email',
        'isAdmin',
      ]),
    },
  });
  //   console.log(res);
});

module.exports = router;
