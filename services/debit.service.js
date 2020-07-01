/* eslint-disable camelcase */
const Bull = require('bull');
const moment = require('moment');
const { Op } = require('sequelize');
const { Random } = require('random-js');
const { sendMail } = require('../utils/mailer');

const models = require('../models');
const { NOTI_DEBIT_QUEUE, REDIS_URL } = require('../constants/queue');

const notiDebitQueue = new Bull(NOTI_DEBIT_QUEUE, REDIS_URL);

const { Debit, Customer } = models;
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
      is_notified: true,
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

const sendEmailCustomer = async ({ email }) => {
  const user = await Customer.findOne({
    where: { email: email },
  });
  if (!user) {
    return {
      error: new Error(ErrorCode.EMAIL_NOT_REGISTERED),
    };
  }
  const OTPCode = new Random().integer(100000, 999999);
  await redisClient.setAsync(`OTP:${email}`, OTPCode, 'EX', 60 * 60); // Expired 1h

  const message = `
    <p>Forgot your password</p>
    <h4>
      Input your OTP code to reset your password
      <i>${OTPCode}</i>
    </h4>
  `;

  // eslint-disable-next-line no-return-await
  return await sendMail(user.email, message);
};

const verifyOTP = async ({ OTP, email }) => {
  try {
    const otpCode = await redisClient.getAsync(`OTP:${email}`);
    return {
      isValid: otpCode === OTP,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const paid = async ({ customer, debitBody }) => {
  try {
    const debit = await Debit.findOne({
      where: {
        id: debitBody.id,
      },
    });
    return debit;
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  getAllDebits,
  create,
  verifyOTP,
  paid,
};
