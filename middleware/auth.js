/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('@sgjobfit/common');

const requireAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new BadRequestError('Not authorized'));
  }

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return next(new BadRequestError(err.message));
  }
};

module.exports = {
  requireAuth,
};
