const _ = require('lodash');
const { Random } = require('random-js');

const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');
const models = require('../models');
const { sendMail } = require('../utils/mailer');

const { Customer, TransactionLog } = models;
const { redisClient } = require('../libs/redis');

const handleTransaction = async transactionData => {
  try {
    if (!transactionData) {
      logger.info('Transaction data is not valid');
      return {
        error: new Error('Transaction data is required'),
      };
    }
    const {
      sender_account_number: senderAccountNumber,
      receiver_account_number: receiverAccountNumber,
      amount,
      message,
      transaction_type: transactionType,
      transfer_method: transferMethod, // 1: tru phi nguoi gui, 2: tru phi nguoi nhan
      partner_code: partnerCode,
    } = transactionData;

    // 1. Xác nhan tai khoan nguoi gui + nguoi nhan co ton tai hay ko ?
    const [sender, receiver] = Promise.all([
      Customer.findOne({
        where: {
          account_number: senderAccountNumber,
        },
      }),
      Customer.findOne({
        where: {
          account_number: receiverAccountNumber,
        },
      }),
    ]);
    if (!sender || !receiver) {
      logger.info('Account is not valid');
      return {
        error: new Error('Account is not valid'),
      };
    }

    // 2: Tạo 1 transaction log -> progress status = 0 (Chua thuc hien)
    const transactionLog = await TransactionLog.create({
      transaction_type: transactionType,
      transfer_method: transferMethod,
      is_actived: true,
      is_notified: false,
      sender_account_number: senderAccountNumber,
      receiver_account_number: receiverAccountNumber,
      amount,
      message,
      partner_code: partnerCode || '',
    });

    // 3. Tạo ra 1 mã OTP 6 số -> store vào redis với expired_time = 30 phút
    const OTPCode = new Random().integer(100000, 999999);
    const cachedData = {
      id: transactionLog.id,
      transaction_type: transactionType,
      transfer_method: transferMethod,
      sender_account_number: senderAccountNumber,
      receiver_account_number: receiverAccountNumber,
      amount,
    };
    await redisClient.setAsync(`Transfer:${OTPCode}`, JSON.stringify(cachedData), 'EX', 30 * 60); // Expired 30 phút
    // 4. Push email tới người thực hiện giao dịch
    const emailContent = `
      <p>Xác nhận giao dịch</p>
      <h4>
        Nhập mã OTP để xác nhận giao dịch
        <i>${OTPCode}</i>
      </h4>
    `;
    return await sendMail(sender.email, emailContent);
  } catch (err) {
    logger.error(err);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const verifyOTP = async ({ OTP }) => {
  try {
    const data = await redisClient.getAsync(`Transfer:${OTP}`);
    const formatedData = JSON.parse(data);
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
    const transferMethod = formatedData.transfer_method;
    const { amount, id } = formatedData;
    const fee = 1000;

    if (transactionType === 1) {
      if (transferMethod === 1) {
        await receiver.updateBalance(amount, 0);
        await sender.updateBalance(-amount, fee);
      } else {
        await receiver.updateBalance(amount, fee);
        await sender.updateBalance(-amount, 0);
      }
    } else if (transactionType === 2) {
      if (transferMethod === 1) {
        await receiver.updateBalance(amount, 0);
      } else {
        await receiver.updateBalance(amount, fee);
      }
    }
    await sender.save();
    await receiver.save();
    const transactionLog = await TransactionLog.findOne({
      where: {
        id,
      },
    });
    transactionLog.setDataValue('progress_status', 1);
    await transactionLog.save();
    return {
      transaction_log: transactionLog,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  handleTransaction,
  verifyOTP,
};
