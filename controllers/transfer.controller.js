/* eslint-disable consistent-return */
const createErrors = require('http-errors');
const logger = require('../utils/logger');
const transferService = require('../services/transfer.service');

const verifyInternalAccount = async (req, res, next) => {
  try {
    const result = await transferService.verifyInternalAccount({
      sender: req.user,
      receiver: req.body.receiver_account_number,
    });
    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (error) {
    logger.error(`Verify internal error ${error}`);
    return next(createErrors(400, error.message));
  }
};

const transferInternal = async (req, res, next) => {
  try {
    const result = await transferService.handleTransaction(req.body);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    res.status(200).json({
      message: 'Success',
      data: result,
    });
  } catch (error) {
    logger.error(`Transfer internal error ${error}`);
    return next(createErrors(400, error.message));
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { OTP } = req.body;
    const result = await transferService.verifyOTP({ OTP });
    if (result.error) {
      return next(createErrors(400, result.error));
    }
    return res.status(200).send({
      message: 'Success',
      data: result.transaction_log,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const verifyPartnerAccount = async (req, res, next) => {
  try {
    const result = await transferService.verifyPartnerAccount({
      sender: req.user,
      receiver: req.body.receiver_account_number,
      partnerCode: req.body.partner_code,
    });
    if (result.error) {
      return next(createErrors(400, result.error));
    }
    return res.status(200).json({
      message: 'Success',
      data: result.result,
    });
  } catch (error) {
    logger.error(`Verify partner error ${error}`);
    return next(createErrors(400, error.message));
  }
};

const transactionPartner = async (req, res, next) => {
  try {
    const { transactionData } = req.body;
    if (!transactionData) {
      return next(createErrors(400, 'Transaction is not allowed'));
    }
    const result = await transferService.handleTransactionPartner(transactionData);
    if (result.error) {
      return next(createErrors(400, result.error));
    }
    res.status(200).json({
      message: 'Success',
      data: result.result,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const verifyOTPPartner = async (req, res, next) => {
  try {
    const { OTP, transactionData } = req.body;
    if (!transactionData || !OTP) {
      return next(createErrors(400, 'Transaction is not allowed'));
    }
    const result = await transferService.verifyOTPPartner({ OTP, transactionData });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      message: 'Success',
      data: result.transaction_log,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  verifyInternalAccount,
  verifyPartnerAccount,
  transactionPartner,
  transferInternal,
  verifyOTP,
  verifyOTPPartner,
};
