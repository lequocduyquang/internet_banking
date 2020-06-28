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

    if (isReceiver) {
      condition = { receiver_account_number: accountNumber };
    }

    if (isSender) {
      condition = { ...condition, sender_account_number: accountNumber };
    }

    if (isRemind && isBeRemind) {
      condition = {
        ...condition,
        [Op.and]: {
          [Op.or]: {
            sender_account_number: accountNumber,
            receiver_account_number: accountNumber,
          },
          transaction_type: 3,
        },
      };
    }

    if (isRemind && !isBeRemind) {
      condition = {
        ...condition,
        [Op.and]: { receiver_account_number: accountNumber, transaction_type: 3 },
      };
    }

    if (isBeRemind && !isRemind) {
      condition = {
        ...condition,
        [Op.and]: { sender_account_number: accountNumber, transaction_type: 3 },
      };
    }

    if (!isReceiver && !isSender && !isBeRemind && !isRemind) {
      condition = { receiver_account_number: accountNumber, sender_account_number: accountNumber };
    }

    const paginationOpts = buildPaginationOpts(req);
    const result = await employeeService.getTransactionLogHistory(
      { [Op.or]: condition },
      sort,
      paginationOpts
    );
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
