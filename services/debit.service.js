/* eslint-disable camelcase */
const _ = require('lodash');
const { Op } = require('sequelize');
const { Random } = require('random-js');
const { sendMail } = require('../utils/mailer');

const models = require('../models');

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

const create = async (id, reminder, data) => {
  try {
    if (_.isEmpty(data)) {
      logger.info('Debit data is not valid');
      return {
        error: new Error('Debit data is required'),
      };
    }
    const { amount, message } = data;
    const newDebit = await Debit.create({
      creator_customer_id: id,
      reminder_id: reminder.id,
      amount: amount,
      message: message,
      is_actived: 1,
      is_notified: 1,
      payment_status: 0, // Chưa trả nợ
    });

    const emailContent = `
      <p>Thông báo nhắc nợ</p>
      <h4>
        Số tiền: <i>${amount} VND</i><br/>
        Lời nhắn: ${message}
      </h4>
    `;
    sendMail(reminder.email, emailContent);
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
    const debits = await Debit.paginate({
      where: {
        is_actived: 1,
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
    const [beReminder, reminder] = await Promise.all([
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
    // const transactionType = formatedData.transaction_type;

    // if (transactionType === 3) {
    // }
    await beReminder.updateBalance(parseInt(formatedData.amount, 10) * -1, 0);
    await beReminder.save();
    await reminder.updateBalance(parseInt(formatedData.amount, 10), 0);
    await reminder.save();
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
    debit.setDataValue('payment_status', 1); // Đã thanh toán
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
    // 1. Xác nhân tài khoản người nợ + người nhắc
    const [beReminder, reminder] = await Promise.all([
      Customer.findOne({
        where: {
          id: customer.id,
        },
      }),
      Customer.findOne({
        where: {
          id: debit.creator_customer_id,
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
      is_actived: 1,
      is_notified: 0,
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
