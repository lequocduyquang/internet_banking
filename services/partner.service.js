const _ = require('lodash');
const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');
const models = require('../models');

const { Customer } = models;

const getProfile = async accountNumber => {
  try {
    const accountProfile = await Customer.findOne({
      where: {
        account_number: accountNumber,
      },
    });
    if (_.isNil(accountProfile)) {
      logger.info('Customer not found');
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    return accountProfile;
  } catch (error) {
    logger.error(`${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  getProfile,
};
