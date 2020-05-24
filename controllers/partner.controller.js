/* eslint-disable camelcase */
const { BadRequestError } = require('@sgjobfit/common');
const { decrypt } = require('../utils/pgp');
const models = require('../models/customer.model');
const transactionLogModel = require('../models/transaction_log.model');
const customerModel = require('../models/customer.model');

const getAccountProfile = async (req, res, next) => {
  try {
    const { message } = req.headers;
    if (!message) {
      throw new BadRequestError('Message is not found');
    }
    const accountNumber = decrypt(message);
    const accountProfile = await models.Customer.findOne({
      where: {
        account_number: accountNumber,
      },
    });
    if (!accountNumber) {
      res.status(404).send({
        message: 'Account profile not found',
      });
    }
    res.status(200).send({
      account_profile: accountProfile,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const sendMoney = async (req, res, next) => {
  try {
    const {
      sender_account_number,
      receiver_account_number,
      amount,
      message,
      transaction_type,
      partner_code,
    } = req.body;
    const transactionLog = await transactionLogModel.TransactionLog.create({
      transaction_type,
      transaction_method: 2,
      is_actived: true,
      is_notified: false,
      sender_account_number,
      receiver_account_number,
      amount,
      message,
      partner_code,
    });
    const customer = await customerModel.Customer.findOne({
      where: { account_number: receiver_account_number },
    });
    if (!customer) {
      res.status(404).send({
        message: 'Customer not found',
      });
    }
    await customer.updateBalance(amount);
    await customer.save();
    res.status(200).json({
      customer,
      transactionLog,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

module.exports = {
  getAccountProfile,
  sendMoney,
};
