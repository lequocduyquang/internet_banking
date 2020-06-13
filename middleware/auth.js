/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const createErrors = require('http-errors');
const { ErrorCode } = require('../constants/ErrorCode');
const models = require('../models');

const requireAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(createErrors(401, ErrorCode.NOT_AUTHORIZED));
  }

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(createErrors(401, err.message));
  }
};

const authorize = (req, res, next) => {
  if (req.user.role !== 1) {
    throw createErrors(403, ErrorCode.FORBIDDEN);
  }
  next();
};

const verifyPartner = async (req, res, next) => {
  const partnerCode = req.headers.partner;
  if (!partnerCode) {
    return next(createErrors(403, ErrorCode.FORBIDDEN));
  }
  try {
    const verified = jwt.verify(partnerCode, process.env.JWT_PARTNER_SECRET);
    if (verified) {
      const payload = jwt.decode(partnerCode, process.env.JWT_PARTNER_SECRET);
      const { name, password, code } = payload;
      const foundPartner = await models.Partner.findOne({
        where: {
          name,
          password,
          code,
        },
      });
      if (!foundPartner) {
        return next(createErrors(401, ErrorCode.PARTNER_INFO_NOT_FOUND));
      }
      next();
    }
  } catch (error) {
    return next(createErrors(401, error.message));
  }
};

const verifyEmployee = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(createErrors(401, ErrorCode.NOT_AUTHORIZED));
  }

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const foundEmployee = await models.Employee.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!foundEmployee) {
      return next(createErrors(401, ErrorCode.EMPLOYEE_INFO_NOT_FOUND));
    }
    req.user = payload;
    next();
  } catch (error) {
    return next(createErrors(401, error.message));
  }
};

module.exports = {
  requireAuth,
  authorize,
  verifyPartner,
  verifyEmployee,
};
