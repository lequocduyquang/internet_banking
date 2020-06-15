/* eslint-disable camelcase */
const _ = require('lodash');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { ErrorCode } = require('../constants/ErrorCode');
const models = require('../models');

const { Customer, TransactionLog } = models;

const getAccount = async customer => {
  try {
    const account = await Customer.findOne({
      where: {
        email: customer.email,
      },
      attributes: ['account_number', 'account_balance'],
    });
    if (_.isNil(account)) {
      logger.info(`POSTGRES: ${ErrorCode.CUSTOMER_INFO_NOT_FOUND}`);
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    return {
      data: account,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getListContacts = async customer => {
  try {
    const listContacts = await Customer.findOne({
      where: {
        id: customer.id,
      },
      attributes: ['list_contact'],
    });
    return {
      data: listContacts,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const createContact = async (customer, { reminder_name: name, account_number: number }) => {
  try {
    const account = await Customer.findOne({
      where: {
        id: customer.id,
      },
    });
    if (_.isNil(account)) {
      logger.info(`POSTGRES: ${ErrorCode.CUSTOMER_INFO_NOT_FOUND}`);
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    // Check contacts have account_number yet
    if (
      !_.find(account.list_contact, { account_number: number }) &&
      account.account_number !== number
    ) {
      // Check account_number in db
      const isValidAccount = await Customer.findOne({
        where: {
          account_number: number,
        },
      });
      if (!isValidAccount) {
        return {
          error: new Error('Account contact is not valid'),
        };
      }
      account.list_contact.push({
        reminder_name: name,
        account_number: number,
      });
      account.setDataValue('list_contact', account.list_contact);
      await account.save();
      return {
        data: account,
      };
    }
    return {
      error: new Error('Account contact is not valid'),
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const deleteContact = async (customer, account_number) => {
  try {
    const account = await Customer.findOne({
      where: {
        id: customer.id,
      },
    });
    if (_.isNil(account)) {
      logger.info(`POSTGRES: ${ErrorCode.CUSTOMER_INFO_NOT_FOUND}`);
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    if (_.find(account.list_contact, { account_number: account_number })) {
      const newListContacts = _.remove(
        account.list_contact,
        item => item.account_number !== account_number
      );
      account.setDataValue('list_contact', newListContacts);
      await account.save();
      return {
        data: account,
      };
    }
    return {
      error: new Error('Account contact is not valid'),
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getTransactionLogHistory = async (customer, condition) => {
  try {
    const account = await Customer.findOne({
      where: {
        id: customer.id,
      },
    });
    if (_.isNil(account)) {
      logger.info(`POSTGRES: ${ErrorCode.CUSTOMER_INFO_NOT_FOUND}`);
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    const history = await TransactionLog.findAll({
      where: {
        ...condition,
        [Op.or]: {
          sender_account_number: account.account_number,
          receiver_account_number: account.account_number,
        },
      },
      order: [['updated_at', 'DESC']],
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

module.exports = {
  getAccount,
  getListContacts,
  createContact,
  deleteContact,
  getTransactionLogHistory,
};
