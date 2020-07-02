/* eslint-disable camelcase */
const _ = require('lodash');
const Bull = require('bull');
const moment = require('moment');
const { Op } = require('sequelize');
const { Random } = require('random-js');
const { sendMail } = require('../utils/mailer');

const models = require('../models');
const { NOTI_DEBIT_QUEUE, REDIS_URL } = require('../constants/queue');

const notiDebitQueue = new Bull(NOTI_DEBIT_QUEUE, REDIS_URL);

const { Debit, Customer, TransactionLog } = models;
const { redisClient } = require('../libs/redis');
const logger = require('../utils/logger');
const { ErrorCode } = require('../constants/ErrorCode');

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

const verifyOTP = async ({ OTP }) => {
  try {
    const data = await redisClient.getAsync(`Debit:${OTP}`);
    const formatedData = JSON.parse(data);
    if (_.isNil(formatedData)) {
      logger.error('OTP Code is wrong');
      return {};
    }
    const [sender, receiver] = Promise.all([
      Customer.findOne({
        where: {
          account_number: formatedData.sender_account_number,
        },
      }),
      Customer.findOne({
        where: {
          account_number: formatedData.receiver_account_number,
        },
      }),
    ]);
    const transactionType = formatedData.transaction_type;

    if (transactionType === 3) {
      await sender.updateBalance(-formatedData.amount, 0);
      await receiver.updateBalance(formatedData.amount, 0);
    }
    await sender.save();
    await receiver.save();
    const transactionLog = await TransactionLog.findOne({
      where: {
        id: formatedData.transaction_id,
      },
    });
    transactionLog.setDataValue('progress_status', 1);
    await transactionLog.save();
    const debit = await Debit.findOne({
      where: {
        id: formatedData.debit_id,
      },
    });
    debit.setDataValue('is_actived', 1); // Đã thanh toán
    await debit.save();
    return {
      debit,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const paid = async ({ customer, debitId }) => {
  try {
    if (!debitId) {
      logger.info('Debit data is not valid');
      return {
        error: new Error('Debit data is required'),
      };
    }
    const debit = await Debit.findOne({
      where: {
        id: debitId,
      },
    });
    if (_.isEmpty(debit)) {
      logger.info('Debit id is not found');
      return {};
    }
    // 1. Xác nhân tài khoản người nợ + người nhắc
    const [beReminder, reminder] = Promise.all([
      Customer.findOne({
        where: {
          id: customer.id,
        },
      }),
      Customer.findOne({
        where: {
          id: debit.reminder_id,
        },
      }),
    ]);
    if (!beReminder || !reminder) {
      logger.info('Account is not valid');
      return {
        error: new Error('Account is not valid'),
      };
    }
    // 2: Tạo 1 transaction log -> progress status = 0 (Chua thuc hien)
    const transactionLog = await TransactionLog.create({
      transaction_type: 3,
      is_actived: true,
      is_notified: false,
      sender_account_number: beReminder.account_number,
      receiver_account_number: reminder.account_number,
      amount: debit.amount,
      message: debit.message,
    });
    // 3. Tạo ra 1 mã OTP 6 số -> store vào redis với expired_time = 30 phút
    const OTPCode = new Random().integer(100000, 999999);
    const cachedData = {
      transaction_id: transactionLog.id,
      debit_id: debit.id,
      transaction_type: 3,
      sender_account_number: beReminder.account_number,
      receiver_account_number: reminder.account_number,
      amount: debit.amount,
    };
    await redisClient.setAsync(`Debit:${OTPCode}`, JSON.stringify(cachedData), 'EX', 30 * 60); // Expired 30 phút
    // 4. Push email tới người thực hiện giao dịch
    const emailContent = `
      <p>Xác nhận giao dịch</p>
      <h4>
        Nhập mã OTP để xác nhận giao dịch
        <i>${OTPCode}</i>
      </h4>
    `;
    return await sendMail(beReminder.email, emailContent);
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
  verifyContact,
};
