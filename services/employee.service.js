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
    logger.error(`Create customer error: ${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const payInCustomer = async ({ accountNumber, amount }) => {
  try {
    const customer = await Customer.findOne({
      where: {
        account_number: accountNumber,
      },
    });
    if (!customer) {
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    const updateAmount = customer.account_balance + parseFloat(amount);
    customer.setDataValue('account_balance', updateAmount);
    await customer.save();
    const transactionLog = await TransactionLog.create({
      transaction_type: 1,
      sender_account_number: 'GDV',
      receiver_account_number: accountNumber,
      amount,
      is_actived: 1,
      message: `${customer.fullname} nộp ${amount} VND vào tài khoản`,
    });
    return {
      data: {
        customer,
        transaction_log: transactionLog,
      },
    };
  } catch (error) {
    logger.info(`Error when pay in customer account ${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getTransactionLogHistory = async (condition, sort, paginationOpts = {}) => {
  try {
    const history = await TransactionLog.paginate({
      where: condition,
      order: [[`${sort.sortBy}`, `${sort.orderBy}`]],
      ...paginationOpts,
    });
    return {
      data: history,
    };
  } catch (error) {
    console.log('Errror: ', error);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getTransactionLogHistoryV2 = async (condition, sort, paginationOpts = {}) => {
  try {
    const history = await TransactionLog.paginate({
      where: condition.value,
      order: [[`${sort.sortBy}`, `${sort.orderBy}`]],
      ...paginationOpts,
    });
    return {
      data: history,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const verifyCustomer = async accountNumber => {
  try {
    const customer = await Customer.findOne({
      where: {
        account_number: accountNumber,
      },
    });
    if (!customer) {
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    return {
      data: customer,
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
  getTransactionLogHistory,
  getTransactionLogHistoryV2,
  verifyCustomer,
};
