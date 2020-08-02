/* eslint-disable camelcase */
const _ = require('lodash');
const { Op } = require('sequelize');
const Bull = require('bull');

const moment = require('moment');
const logger = require('../utils/logger');
const { ErrorCode } = require('../constants/ErrorCode');
const { NOTI_DEBIT_QUEUE, REDIS_URL } = require('../constants/queue');
const { redisClient } = require('../libs/redis');
const models = require('../models');

const { Customer, TransactionLog, Debit } = models;

const notiDebitQueue = new Bull(NOTI_DEBIT_QUEUE, REDIS_URL);

const getAccount = async customer => {
  try {
    const account = await Customer.findOne({
      where: {
        email: customer.email,
      },
      attributes: [
        'fullname',
        'account_number',
        'account_balance',
        'phone',
        'address',
        'list_contact',
      ],
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
    logger.error(`Get account error: ${error.message}`);
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
    logger.error(`Get list contacts: ${error.message}`);
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
        reminder_name: name || isValidAccount.username,
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
    logger.error(`Create contact error: ${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const updateContact = async (customer, account_number, reminder_name) => {
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
    // eslint-disable-next-line array-callback-return
    const foundIndex = account.list_contact.findIndex(
      contact => contact.account_number === account_number
    );
    account.list_contact[foundIndex].reminder_name = reminder_name;
    console.log('New Contacts list: ', account.list_contact);
    account.setDataValue('list_contact', account.list_contact);
    await account.save();
    return {
      data: account,
    };
  } catch (error) {
    logger.error(`Update contact error: ${error.message}`);
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
    logger.error(`Delete contact error: ${error.message}`);
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
    logger.error(`Get transaction log error: ${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const verifyContact = async accountNumber => {
  try {
    const customer = await Customer.findOne({
      where: {
        account_number: accountNumber,
      },
      attributes: { exclude: ['password', 'account_balance'] },
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

const getAllDebits = async customer => {
  try {
    const debits = await Debit.findAll({
      where: {
        [Op.or]: {
          creator_customer_id: customer.id,
          reminder_id: customer.id,
        },
      },
      order: [['updated_at', 'DESC']],
    });
    return {
      data: debits,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const createDebit = async (customer, { reminder_id, amount, message }) => {
  try {
    const newDebit = await Debit.create({
      creator_customer_id: customer.id,
      reminder_id: reminder_id,
      amount: amount,
      message: message,
    });
    const cachedData = {
      creator_customer_id: customer.id,
      reminder_id: reminder_id,
      amount: amount,
      message: message,
      created_at: moment(),
    };
    const key = `Debit:${newDebit.id}Creator:${customer.id}:Reminder:${reminder_id}`;
    const cacheKey = await redisClient.getAsync(key);

    if (!cacheKey) {
      await redisClient.setexAsync(key, 86400, key); // expire in 1 day
      await notiDebitQueue.add(cachedData, {
        delay: 60000,
      });
    }

    return {
      data: newDebit,
    };
  } catch (error) {
    console.log(error);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  getAccount,
  getListContacts,
  createContact,
  updateContact,
  deleteContact,
  getTransactionLogHistory,
  verifyContact,
  getAllDebits,
  createDebit,
};
