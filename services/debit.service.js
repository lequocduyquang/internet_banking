/* eslint-disable camelcase */
const Bull = require('bull');
const moment = require('moment');
const { Op } = require('sequelize');

const models = require('../models');
const { NOTI_DEBIT_QUEUE, REDIS_URL } = require('../constants/queue');

const notiDebitQueue = new Bull(NOTI_DEBIT_QUEUE, REDIS_URL);

const { Debit } = models;
const { redisClient } = require('../libs/redis');
const logger = require('../utils/logger');
const { ErrorCode } = require('../constants/ErrorCode');

const create = async (id, data) => {
  try {
    if (!data) {
      logger.info('Debit data is not valid');
      return {
        error: new Error('Debit data is required'),
      };
    }
    const { reminder_id, amount, message } = data;
    const newDebit = await Debit.create({
      creator_customer_id: id,
      reminder_id: reminder_id,
      amount: amount,
      message: message,
    });
    const cachedData = {
      creator_customer_id: id,
      reminder_id: reminder_id,
      amount: amount,
      message: message,
      created_at: moment(),
    };
    const key = `Debit:${newDebit.id}Creator:${id}:Reminder:${reminder_id}`;
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
    logger.error(error.message);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getAllDebits = async id => {
  try {
    const debits = await Debit.findAll({
      where: {
        [Op.or]: {
          creator_customer_id: id,
          reminder_id: id,
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

module.exports = {
  getAllDebits,
  create,
};
