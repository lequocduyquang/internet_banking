/* eslint-disable consistent-return */
const _ = require('lodash');
const { Op } = require('sequelize');
const createErrors = require('http-errors');
const { buildPaginationOpts, decoratePaginatedResult } = require('../utils/paginate');
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
  try {
    const { account_number: accountNumber, amount } = req.body;
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

    const customer = await employeeService.verifyCustomer(accountNumber);
    if (customer.error) {
      return next(createErrors(400, customer.error.message));
    }
    const q = JSON.parse(req.query.q);
    const { isReceiver, isSender, isRemind, isBeRemind } = q;

    if (!accountNumber) {
      return next(createErrors(400, 'Account number must be valid'));
    }
    const sort = {
      sortBy: req.query.sortBy || 'created_at',
      orderBy: req.query.orderBy || 'DESC',
    };

    let condition = {};
    if (isReceiver && !isSender) {
      condition = { receiver_account_number: accountNumber };
    }
    if (isSender && !isReceiver) {
      condition = { sender_account_number: accountNumber };
    }
    if ((isReceiver && isSender) || (!isReceiver && !isSender && !isRemind && !isBeRemind)) {
      condition = {
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
        },
      };
    }

    // Nhac no DEBIT - Transaction type = 3
    if (isBeRemind) {
      condition = { ...condition, transaction_type: 3, sender_account_number: accountNumber };
    }
    if (isRemind) {
      condition = { ...condition, transaction_type: 3, receiver_account_number: accountNumber };
    }
    const paginationOpts = buildPaginationOpts(req);
    const result = await employeeService.getTransactionLogHistory(condition, sort, paginationOpts);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      ...decoratePaginatedResult(result.data, paginationOpts),
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
