/* eslint-disable camelcase */
const createErrors = require('http-errors');
const { decrypt } = require('../utils/pgp');
const partnerService = require('../services/partner.service');

const getAccountProfile = async (req, res, next) => {
  try {
    const { message } = req.headers;
    if (!message) {
      return next(createErrors(400, 'Message is not found'));
    }
    const accountNumber = decrypt(message);
    const accountProfile = await partnerService.getProfile(accountNumber);
    if (!accountNumber) {
      return res.status(404).send({
        message: 'Account profile not found',
      });
    }
    return res.status(200).send({
      account_profile: accountProfile,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  getAccountProfile,
};
