const { Op } = require('sequelize');
const createErrors = require('http-errors');

const employeeService = require('../services/employee.service');

const createCustomer = async (req, res, next) => {
  try {
    const { username, email, password, fullname, phone, address } = req.body;
    const result = await employeeService.createCustomer({
      username,
      email,
      password,
      fullname,
      phone,
      address,
    });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      customer: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const verifyCustomer = async (req, res, next) => {
  try {
    const { account_number: accountNumber } = req.body;
    const result = await employeeService.verifyCustomer(accountNumber);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      customer: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const payInCustomer = async (req, res, next) => {
  console.log('Step 1:');
  try {
    const { account_number: accountNumber, amount } = req.body;
    console.log('Req body: ', req.body);
    const result = await employeeService.payInCustomer({ accountNumber, amount });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      customer: result.data.customer,
      transaction_log: result.data.transaction_log,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const getTransactionLog = async (req, res, next) => {
  try {
    const { account_number: accountNumber } = req.params;
    let condition = {};
    if (!accountNumber) {
      return next(createErrors(400, 'Account number not found'));
    }
    if (req.query.isReceive) {
      condition = { ...condition, receiver_account_number: accountNumber };
    }
    if (req.query.isSender) {
      condition = { ...condition, sender_account_number: accountNumber };
    }
    if (req.query.isBeRemind) {
      condition = { ...condition, transaction_type: 3, sender_account_number: accountNumber };
    }
    if (req.query.isRemind) {
      if (req.query.isBeRemind) {
        condition = { ...condition, transaction_type: 3, receiver_account_number: accountNumber };
      }
    }
    if (req.query.all) {
      condition = {
        ...condition,
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
        },
      };
    }
    const result = await employeeService.getTransactionLogHistory(condition);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      history: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  createCustomer,
  payInCustomer,
  verifyCustomer,
  getTransactionLog,
};
