/* eslint-disable camelcase */
const createErrors = require('http-errors');
const { Op } = require('sequelize');
const { buildPaginationOpts, decoratePaginatedResult } = require('../utils/paginate');

const customerService = require('../services/customer.service');
const { redisClient } = require('../libs/redis');

const getMyAccount = async (req, res, next) => {
  try {
    const result = await customerService.getAccount(req.user);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      my_account: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const result = await customerService.getListContacts(req.user);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      contacts: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const createContact = async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const { reminder_name, account_number } = req.body;
    const result = await customerService.createContact(req.user, { reminder_name, account_number });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      contact: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { account_number } = req.params;
    const { reminder_name } = req.body;
    const result = await customerService.updateContact(req.user, account_number, reminder_name);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      contact: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const deleteContact = async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const { account_number } = req.params;
    const result = await customerService.deleteContact(req.user, account_number);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      contact: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const verifyContact = async (req, res, next) => {
  try {
    const { account_number: accountNumber } = req.body;
    const result = await customerService.verifyContact(accountNumber);
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

const getHistory = async (req, res, next) => {
  try {
    const { account_number: accountNumber } = req.params;
    console.log('account numbers: ', accountNumber);

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

    const result = await customerService.getTransactionLogHistory(
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

const getAllDebits = async (req, res, next) => {
  try {
    const result = await customerService.getAllDebits(req.user);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      debits: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const createDebit = async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const { reminder_id: id, amount, message } = req.body;
    const { io } = req;
    redisClient.hgetall('socketIds', (err, result) => {
      console.log('Result: ', result[`Customer|${id}`]);
      io.to(result[`Customer|${id}`]).emit('followNoti', 'Thông báo nhắc nợ');
    });
    const result = await customerService.createDebit(req.user, { id, amount, message });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }

    return res.status(200).json({
      success: true,
      new_debit: result.data,
    });
  } catch (error) {
    console.log('Error: ', error);
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  getMyAccount,
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
  verifyContact,
  getHistory,
  getAllDebits,
  createDebit,
};
