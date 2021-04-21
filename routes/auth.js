const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.post('/sign-in', async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: error.details[0].message,
    });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({
      status: 'error',
      statusCode: 404,
      error: 'No registered user with given email',
    });

  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword)
    return res
      .status(400)
      .json({ status: 'error', statusCode: 400, error: 'Invalid password' });

  const token = await user.generateAuthToken();

  res.json({
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
});

// router.get('/logout', auth, function (req, res) {
//   req.user.deleteToken(req.token, (err, user) => {
//     if (err) return res.status(400).send(err);
//     res.status(200).send('you have successfully logged out');
//   });
// });

function validate(req) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
