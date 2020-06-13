const { validationResult } = require('express-validator');
const createErrors = require('http-errors');

// eslint-disable-next-line consistent-return
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsg = errors
      .array()
      .map(item => item.msg)
      .join('. ');
    return next(createErrors(401, errMsg));
  }
  next();
};

module.exports = {
  validateRequest,
};
