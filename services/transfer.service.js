const _ = require('lodash');
const axios = require('axios');
const crypto = require('crypto');
const openpgp = require('openpgp');
const { Random } = require('random-js');

const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');
const models = require('../models');
const { sendMail } = require('../utils/mailer');

const { Customer, TransactionLog } = models;
const { redisClient } = require('../libs/redis');

const customGetInfoPartner = async accountId => {
  const secretKey = 'day la secret key';
  const partnerPublicKey = '';
  const ourPrivateKey = '';
  const passphrase = '123456';

  const accountIdHashed = crypto.createHmac('SHA1', secretKey).update(accountId).digest('hex');

  let { data: accountIdEncrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(accountId),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });

  accountIdEncrypted = accountIdEncrypted.replace(/\r/g, '\\n').replace(/\n/g, '');
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(ourPrivateKey);
  await privateKey.decrypt(passphrase);

  let { data: digitalSignature } = await openpgp.sign({
    message: openpgp.cleartext.fromText(accountId),
    privateKeys: [privateKey],
  });

  digitalSignature = digitalSignature.replace(/\r/g, '\\n').replace(/\n/g, '');
  const currentTime = Math.round(new Date().getTime());
  const entryTimeHashed = crypto
    .createHmac('SHA1', secretKey)
    .update(currentTime.toString())
    .digest('hex');

  let { data: entryTimeEncrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(currentTime.toString()),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });

  entryTimeEncrypted = entryTimeEncrypted.replace(/\r/g, '\\n').replace(/\n/g, '');

  return {
    digitalSignature,
    accountIdHashed,
    accountIdEncrypted,
    entryTimeHashed,
    entryTimeEncrypted,
  };
};

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
      attributes: ['username', 'account_number'],
    });
    return foundReceiver;
  } catch (error) {
    logger.error(`Error when verify transfer internal: ${error}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const verifyPartnerAccount = async ({ sender, receiver }) => {
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
    const {
      digitalSignature,
      accountIdHashed,
      accountIdEncrypted,
      entryTimeHashed,
      entryTimeEncrypted,
    } = await customGetInfoPartner(receiver);
    const options = {
      url: 'http://localhost:5000/transactions/receiver-interbank',
      method: 'GET',
      headers: {
        x_partner_code: 'QUANGLE',
        x_signature: digitalSignature,
        x_account_id_hashed: accountIdHashed,
        x_account_id_encrypted: accountIdEncrypted,
        x_entry_time_encrypted: entryTimeEncrypted,
        x_entry_time_hashed: entryTimeHashed,
      },
    };
    const foundReceiver = await axios(options);
    return foundReceiver.data; // Verify lại với bên cung cấp API để viết axios cho đúng
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

const handleTransactionPartner = async transactionData => {
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
    // Call API to verify acc in another banking
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

    // Flow còn lại tương tự
    // 2: Tạo 1 transaction log -> progress status = 0 (Chua thuc hien)
    const transactionLog = await TransactionLog.create({
      transaction_type: transactionType,
      transfer_method: transferMethod,
      is_actived: 1,
      is_notified: 0,
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
  } catch (error) {
    logger.error(`Transaction partner error: ${error.message}`);
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

module.exports = {
  verifyInternalAccount,
  verifyPartnerAccount,
  handleTransaction,
  handleTransactionPartner,
  verifyOTP,
};
