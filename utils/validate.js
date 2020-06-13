const { validationResult } = require('express-validator');
const createErrors = require('http-errors');
const { ErrorCode } = require('../constants/ErrorCode');

// eslint-disable-next-line consistent-return
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createErrors(401, ErrorCode.PARAMS_NOT_FOUND));
  }
  next();
};

module.exports = {
  validateRequest,
};
