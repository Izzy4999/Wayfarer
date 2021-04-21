module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ status: 'error', statusCode: 403, error: 'Access denied.' });

  next();
};
