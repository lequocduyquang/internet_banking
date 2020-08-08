/* eslint-disable consistent-return */
const _ = require('lodash');
const { Random } = require('random-js');
const config = require('../config');

const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');
const models = require('../models');
const { sendMail } = require('../utils/mailer');

const { Customer, TransactionLog, Partner } = models;
const { redisClient } = require('../libs/redis');
const {
  getCustomerInfoPartner,
  transferMoneyPartner,
  getCustomerInfoS2QBank,
  transferMoneyS2QBank,
} = require('../utils/partner');

const verifyInternalAccount = async ({ sender, receiver }) => {
  try {
    const foundSender = await Customer.findOne({
      where: {
        id: sender.id,
      },
    });
    if (!foundSender) {
      logger.info('Account sender is not valid');
      return {
        error: new Error('Account sender is not valid'),
      };
    }
    const foundContactList = foundSender.list_contact.find(
      item => item.account_number === receiver
    );
    if (foundContactList) {
      console.log('Get from contact list');
      return foundContactList;
    }
    const foundReceiver = await Customer.findOne({
      where: {
        account_number: receiver,
      },
      attributes: ['username', 'account_number', 'email', 'phone', 'address'],
    });
    return foundReceiver;
  } catch (error) {
    logger.error(`Error when verify transfer internal: ${error}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

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

    // 1' : Update lại flow trên
    const sender = await Customer.findOne({
      where: {
        account_number: senderAccountNumber,
      },
    });
    if (!sender) {
      logger.info('Account sender is not valid');
      return {
        error: new Error('Account sender is not valid'),
      };
    }
    if (sender.account_balance < amount) {
      logger.info('Account balance must be >= amount');
      return {
        error: new Error('Account balance must be >= amount'),
      };
    }

    // 2: Tạo 1 transaction log -> progress status = 0 (Chua thuc hien)
    const transactionLog = await TransactionLog.create({
      transaction_type: transactionType || 1, // 1: INTERNAL
      transfer_method: transferMethod, // Trừ phí 1: Người gửi - 2: Người nhận
      is_actived: 1,
      is_notified: 0,
      sender_account_number: senderAccountNumber,
      receiver_account_number: receiverAccountNumber,
      amount,
      message,
      partner_code: partnerCode || '',
      progress_status: 0,
    });

    // 3. Tạo ra 1 mã OTP 6 số -> store vào redis với expired_time = 30 phút
    const OTPCode = new Random().integer(100000, 999999);
    const cachedData = {
      id: transactionLog.id,
      transaction_type: transactionType || 1,
      transfer_method: transferMethod || 1,
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
    logger.error(`Error when create transfer internal: ${err}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const verifyOTP = async ({ OTP }) => {
  try {
    const data = await redisClient.getAsync(`Transfer:${OTP}`);
    const formatedData = JSON.parse(data);
    const [sender, receiver] = await Promise.all([
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

    console.log('Transaction type and transaction method: ', transactionType, transferMethod);

    if (transactionType === 1) {
      if (transferMethod === 1) {
        await receiver.updateBalance(amount, 0);
        await sender.updateBalance(-amount, fee);
      } else {
        await receiver.updateBalance(amount, fee);
        await sender.updateBalance(-amount, 0);
      }
    } else if (transactionType === 2) {
      // Ko cần ví đã có flow partner
      if (transferMethod === 1) {
        await receiver.updateBalance(amount, 0);
      } else {
        await receiver.updateBalance(amount, fee);
      }
    }
    if (!_.find(sender.list_contact, { account_number: receiver.account_number })) {
      sender.list_contact.push({
        reminder_name: receiver.username,
        account_number: receiver.account_number,
      });
      sender.setDataValue('list_contact', sender.list_contact);
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
    console.log('Error when verify code: ', error);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

/** PARTNER */
const verifyPartnerAccount = async ({ sender, receiver, partnerCode }) => {
  try {
    const foundSender = await Customer.findOne({
      where: {
        id: sender.id,
      },
    });
    if (!foundSender) {
      logger.info('Account sender is not valid');
      return {
        error: new Error('Account sender is not valid'),
      };
    }
    const foundContactList = foundSender.list_contact.find(
      item => item.account_number === receiver
    );
    if (foundContactList) {
      console.log('Get from contact list');
      return foundContactList;
    }
    const partner = await Partner.findOne({
      where: {
        code: partnerCode,
      },
    });
    if (!partner) {
      logger.info('Partner is not valid');
      return {
        error: new Error('Partner is not valid'),
      };
    }
    if (partner.name === 'SANGLE') {
      const foundReceiver = await getCustomerInfoPartner(
        receiver,
        config.sangle2,
        config.my_pgp_private_key
      );
      if (foundReceiver.error) {
        return {
          error: new Error(foundReceiver.error),
        };
      }
      return {
        result: foundReceiver.result.data,
      };
    }
    if (partner.name === 'QUANGNGUYEN') {
      const foundReceiver = await getCustomerInfoS2QBank(receiver);
      return {
        result: foundReceiver,
      };
    }
  } catch (error) {
    logger.error(`Error when verify transfer internal: ${error}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const handleTransactionPartner = async transactionData => {
  try {
    if (!transactionData) {
      logger.info('Transaction data is not valid');
      return {
        error: new Error('Transaction data is required'),
      };
    }
    // const {
    //   sender_account_number: senderAccountNumber,
    //   receiver_account_number: receiverAccountNumber,
    //   amount,
    //   message,
    //   transaction_type: transactionType,
    //   transfer_method: transferMethod, // 1: tru phi nguoi gui, 2: tru phi nguoi nhan
    //   partner_code: partnerCode,
    // } = transactionData;

    const dataSend = {
      toAccountId: transactionData.receiver_account_number,
      toFullName: transactionData.receiver_full_name,
      fromAccountId: transactionData.sender_account_number,
      fromFullName: transactionData.sender_account_full_name,
      fromBankId: 'S2Q Bank',
      transactionAmount: transactionData.amount,
      isFeePayBySender: transactionData.transfer_method === 1,
      fee: 1000,
      transactioionMessage: transactionData.message,
    };

    // 1:
    const sender = await Customer.findOne({
      where: {
        account_number: transactionData.sender_account_number,
      },
    });
    if (!sender) {
      logger.info('Account sender is not valid');
      return {
        error: new Error('Account sender is not valid'),
      };
    }
    if (sender.account_balance < transactionData.amount) {
      logger.info('Account balance must be >= amount');
      return {
        error: new Error('Account balance must be >= amount'),
      };
    }
    // const partnerTransaction = await transferMoneyPartner(transactionData);
    // 2: Tạo 1 transaction log -> progress status = 0 (Chua thuc hien)
    const transactionLog = await TransactionLog.create({
      transaction_type: transactionData.transaction_type || 2, // PARTNER
      transfer_method: transactionData.transfer_method || 1, // Trừ phú 1: Người gửi - 2: Người nhận
      is_actived: 1,
      is_notified: 0,
      sender_account_number: transactionData.sender_account_number,
      receiver_account_number: transactionData.receiver_account_number,
      amount: transactionData.amount,
      message: transactionData.message,
      partner_code: transactionData.partner_code || '',
      progress_status: 0,
    });

    // 3. Tạo ra 1 mã OTP 6 số -> store vào redis với expired_time = 30 phút
    const OTPCode = new Random().integer(100000, 999999);
    const cachedData = {
      id: transactionLog.id,
      transaction_type: transactionData.transaction_type || 2,
      transfer_method: transactionData.transfer_method || 1,
      sender_account_number: transactionData.sender_account_number,
      receiver_account_number: transactionData.receiver_account_number,
      amount: transactionData.amount,
      partner_code: transactionData.partner_code,
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
  } catch (error) {
    logger.error(`Transaction partner error: ${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const verifyOTPPartner = async ({ OTP, transactionData }) => {
  try {
    const data = await redisClient.getAsync(`Transfer:${OTP}`);
    const formatedData = JSON.parse(data);
    const sender = await Customer.findOne({
      where: {
        account_number: formatedData.sender_account_number,
      },
    });
    if (formatedData.partner_code === 'QUANGNGUYEN') {
      const transactionType = formatedData.transaction_type;
      const transferMethod = formatedData.transfer_method;
      const { amount, id } = formatedData;
      const fee = 1000;

      console.log('Transaction type and transaction method: ', transactionType, transferMethod);
      // const dataSend = {
      //   des_acc: transactionData.receiver_account_number,
      //   toFullName: transactionData.receiver_full_name || 'Nguyen Hoang Sang',
      //   src_acc: transactionData.sender_account_number,
      //   username: transactionData.sender_account_full_name || 'Quang Le',
      //   fromBankId: 'S2Q Bank',
      //   amount: transactionData.amount,
      //   isFeePayBySender: transactionData.transfer_method === 1,
      //   fee: fee,
      //   message: transactionData.message,
      // };
      if (transferMethod === 1) {
        const resp = await transferMoneyS2QBank(
          transactionData.receiver_account_number,
          transactionData.amount,
          transactionData.message
        );
        if (resp.data) {
          await sender.updateBalance(-amount, fee);
        }
      } else {
        const resp = await transferMoneyS2QBank(
          transactionData.receiver_account_number,
          transactionData.amount,
          transactionData.message
        );
        if (resp.data) {
          await sender.updateBalance(-amount, 0);
        }
      }
      await sender.save();
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
    }
    const transactionType = formatedData.transaction_type;
    const transferMethod = formatedData.transfer_method;
    const { amount, id } = formatedData;
    const fee = 1000;

    console.log('Transaction type and transaction method: ', transactionType, transferMethod);
    const dataSend = {
      des_acc: transactionData.receiver_account_number,
      toFullName: transactionData.receiver_full_name || 'Nguyen Hoang Sang',
      src_acc: transactionData.sender_account_number,
      username: transactionData.sender_account_full_name || 'Quang Le',
      fromBankId: 'S2Q Bank',
      amount: transactionData.amount,
      isFeePayBySender: transactionData.transfer_method === 1,
      fee: fee,
      message: transactionData.message,
    };
    console.log('DATA SEND: ', dataSend);
    if (transferMethod === 1) {
      const resp = await transferMoneyPartner(dataSend, config.myPGPPrivateKey2, config.sangle2);
      if (resp.data.status === 'OK') {
        await sender.updateBalance(-amount, fee);
      }
    } else {
      const resp = await transferMoneyPartner(dataSend, config.myPGPPrivateKey2, config.sangle2);
      if (resp.data.status === 'OK') {
        await sender.updateBalance(-amount, 0);
      }
    }
    await sender.save();
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
    console.log('Error when verify code: ', error);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  verifyInternalAccount,
  handleTransaction,
  verifyOTP,
  verifyPartnerAccount,
  handleTransactionPartner,
  verifyOTPPartner,
};
