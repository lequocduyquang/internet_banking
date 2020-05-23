/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('@sgjobfit/common');
const models = require('../models');
const { pgp } = require('../config/config');

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

const verifyPartner = async (req, res, next) => {
  const partnerCode = req.headers.partner;
  if (!partnerCode) {
    next(new BadRequestError('You are not allowed to access this resource'));
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
        next(new BadRequestError('Partner code not found'));
      }
      next();
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  requireAuth,
  verifyPartner,
};
