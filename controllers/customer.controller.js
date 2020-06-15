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

module.exports = {
  getMyAccount,
  createContact,
  getAllContacts,
};
