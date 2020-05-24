/* eslint-disable consistent-return */
const { BadRequestError } = require('@sgjobfit/common');
const logger = require('../utils/logger');
const models = require('../models');
const { transaction } = require('../config/config');

const { Customer, TransactionLog } = models;
const { decrypt } = require('../utils/pgp');

const handleTransaction = async transactionData => {
  try {
    if (!transactionData) {
      throw new BadRequestError('Transaction data is required');
    }
    const {
      sender_account_number: senderAccountNumber,
      receiver_account_number: receiverAccountNumber,
      amount,
      message,
      transaction_type: transactionType,
      transaction_method: transactionMethod, // 1: tru phi nguoi gui, 2: tru phi nguoi nhan
      partner_code: partnerCode,
    } = transactionData;
    const transactionLog = await TransactionLog.create({
      transaction_type: transactionType,
      transaction_method: transactionMethod,
      is_actived: true,
      is_notified: false,
      sender_account_number: senderAccountNumber,
      receiver_account_number: receiverAccountNumber,
      amount,
      message,
      partner_code: partnerCode || null,
    });
    console.log('transactionLog: ', transactionLog);
    const receiver = await Customer.findOne({
      where: {
        account_number: receiverAccountNumber,
      },
    });
    if (transactionMethod === 1) await receiver.updateBalance(amount, 0);
    else await receiver.updateBalance(amount, transaction.fee);
    await receiver.save();
    return {
      receiver,
      transaction_log: transactionLog,
    };
  } catch (error) {
    logger.error(error.message);
    return [];
  }
};

const transactionPartner = async (req, res, next) => {
  try {
    const { message, privateKey } = req.body;
    if (!message || !privateKey) {
      throw new BadRequestError('Transaction is not allowed');
    }
    const transactionData = await decrypt({ newPrivateKey: privateKey, encrypted: message });
    const result = await handleTransaction(transactionData);
    res.status(200).json({
      message: 'Transaction successfully',
      data: result,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const transactionInternal = async (req, res, next) => {
  try {
    const result = await handleTransaction(req.body);
    res.status(200).json({
      message: 'Transaction successfully',
      data: result,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

module.exports = {
  transactionPartner,
  transactionInternal,
};
