const createErrors = require('http-errors');
const customerService = require('../services/customer.service');

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

const getHistory = async (req, res, next) => {
  try {
    let condition = {};
    if (req.query.isReceive) {
      condition = { ...condition };
    }
    if (req.query.isSender) {
      condition = { ...condition };
    }
    if (req.query.isBeRemind) {
      condition = { ...condition, transaction_type: 3 };
    }
    if (req.query.isRemind) {
      if (req.query.isBeRemind) {
        condition = { ...condition, transaction_type: 3 };
      }
    }
    if (req.query.all) {
      condition = {
        ...condition,
      };
    }
    const result = await customerService.getTransactionLogHistory(req.user, condition);
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
    const { reminder_id, amount, message } = req.body;
    const result = await customerService.createDebit(req.user, { reminder_id, amount, message });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      new_debit: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  getMyAccount,
  createContact,
  getAllContacts,
  deleteContact,
  getHistory,
  getAllDebits,
  createDebit,
};
