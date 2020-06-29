/* eslint-disable consistent-return */
const createErrors = require('http-errors');
const logger = require('../utils/logger');
const transferService = require('../services/transfer.service');

const { decrypt } = require('../utils/pgp');

const transferInternal = async (req, res, next) => {
  try {
    const result = await transferService.handleTransaction(req.body);
    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (error) {
    logger.error(`Transfer internal error ${error}`);
    return next(createErrors(400, error.message));
  }
};

const transactionPartner = async (req, res, next) => {
  try {
    const { message, privateKey } = req.body;
    if (!message || !privateKey) {
      return next(createErrors(400, 'Transaction is not allowed'));
    }
    const transactionData = await decrypt({ newPrivateKey: privateKey, encrypted: message });
    const result = await transferService.handleTransaction(transactionData);
    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { OTP } = req.body;
    const result = await transferService.verifyOTP({ OTP });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      valid: result.isValid,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  transactionPartner,
  transferInternal,
  verifyOTP,
};
