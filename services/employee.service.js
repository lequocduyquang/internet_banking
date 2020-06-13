const _ = require('lodash');
const { Random } = require('random-js');
const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');
const models = require('../models');

const { Customer, TransactionLog } = models;

const createCustomer = async ({ username, email, password, fullname, phone, address }) => {
  try {
    const isExistedUser = await Customer.findOne({
      where: {
        email: email,
      },
    });
    if (isExistedUser) {
      logger.info(`POSTGRES: ${ErrorCode.CUSTOMER_EMAIL_IS_EXIST}`);
      return {
        error: new Error(ErrorCode.CUSTOMER_EMAIL_IS_EXIST),
      };
    }
    const accountNumber = new Random().integer(1000000000, 9999999999);
    const customer = await Customer.create({
      username,
      password,
      email,
      fullname,
      phone,
      address,
      account_number: accountNumber,
      account_balance: 0,
      status: 1,
      list_contact: [],
    });
    return {
      data: customer,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const payInCustomer = async ({ accountNumber, amount }) => {
  try {
    const customer = await Customer.findOne({
      account_number: accountNumber,
    });
    if (!customer) {
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    customer.setDataValue('account_balance', +amount);
    await customer.save();
    const transactionLog = await TransactionLog.create({
      transaction_type: 1,
      sender_account_number: accountNumber,
      amount,
      message: `${customer.fullname} nộp ${amount}vnd vào tài khoản`,
    });
    return {
      data: {
        customer,
        transaction_log: transactionLog,
      },
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  createCustomer,
  payInCustomer,
};
