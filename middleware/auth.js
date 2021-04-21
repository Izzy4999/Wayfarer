const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    res
      .status(401)
      .json({ status: 'error', statusCode: 401, error: 'Access not granted' });

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(400)
      .json({
        status: 'error',
        statusCode: 400,
        error: 'Wrong token provided',
      });
  }
};
