const { BadRequestError } = require('@sgjobfit/common');
const logger = require('../utils/logger');
const models = require('../models/customer.model');

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
      partner_code: partnerCode,
    } = transactionData;
    const transactionLog = await TransactionLog.create({
      transaction_type: transactionType,
      transaction_method: 2,
      is_actived: true,
      is_notified: false,
      sender_account_number: senderAccountNumber,
      receiver_account_number: receiverAccountNumber,
      amount,
      message,
      partner_code: partnerCode,
    });
    const receiver = await Customer.findOne({
      where: {
        account_number: receiverAccountNumber,
      },
    });
    await receiver.updateBalance(amount);
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
