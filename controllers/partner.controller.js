/* eslint-disable camelcase */
const openpgp = require('openpgp');
const createErrors = require('http-errors');
const { generatePartnerCode } = require('../utils/partner');
const models = require('../models');

const { Partner, Customer, TransactionLog } = models;

const generateNewPrivateKey = async (priKey, password) => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(priKey);
  await privateKey.decrypt(password);
  return privateKey;
};

const decryptMessage = async (pubKey, priKey, mess) => {
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.message.readArmored(mess),
    publicKeys: (await openpgp.key.readArmored(pubKey)).keys,
    privateKeys: [priKey],
  });
  return decrypted;
};

const verifySign = async (pubKey, sign) => {
  const verified = await openpgp.verify({
    message: await openpgp.cleartext.readArmored(sign),
    publicKeys: (await openpgp.key.readArmored(pubKey)).keys, // for verification
  });
  return verified;
};

const getAccountProfile = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return next(createErrors(400, 'Message is not allowed null'));
    }
    const partner = await Partner.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!partner) {
      return next(createErrors(400, 'Partner is not found'));
    }
    const privateKey = await generateNewPrivateKey(partner.private_key, partner.password);
    const accountNumber = await decryptMessage(partner.public_key, privateKey, message);
    const parsedAccountNumber = JSON.parse(accountNumber);
    const customer = await Customer.findOne({
      where: {
        account_number: parsedAccountNumber.account_number,
      },
      attributes: { exclude: ['password', 'account_balance', 'list_contact'] },
    });
    if (!customer) {
      return res.status(404).send({
        message: 'Account profile not found',
      });
    }
    return res.status(200).send({
      account_profile: customer,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const payin = async (req, res, next) => {
  try {
    const { message, sign_partner } = req.body;
    if (!message || !sign_partner) {
      return next(createErrors(400, 'Message and Signature are not allowed null'));
    }
    const partner = await Partner.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!partner) {
      return next(createErrors(400, 'Partner is not found'));
    }

    const verified = await verifySign(partner.public_key, sign_partner);
    const { valid } = verified.signatures[0];
    if (!valid) {
      return res.status(400).send({
        message: 'Signature is not valid',
      });
    }
    const privateKey = await generateNewPrivateKey(partner.private_key, partner.password);
    const data = await decryptMessage(partner.public_key, privateKey, message);
    const parsedData = JSON.parse(data);
    const customer = await Customer.findOne({
      where: {
        account_number: parsedData.account_number,
      },
      attributes: { exclude: ['password', 'list_contact'] },
    });
    if (!customer) {
      return res.status(404).send({
        message: 'Account profile not found',
      });
    }

    await customer.updateBalance(parsedData.amount, 0);
    await customer.save();

    const transactionLog = await TransactionLog.create({
      transaction_type: 2, // Partner
      is_actived: 1,
      is_notified: 0,
      receiver_account_number: parsedData.account_number,
      amount: parsedData.amount,
      message: parsedData.message,
      partner_code: req.user.code,
      progress_status: 1,
    });
    await transactionLog.save();
    return res.status(200).send({
      message: 'Transaction successfully',
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

// {
//   "account_number": "3567913535",
//   "amount": 100000,
//   "message": "Chuyển tiền liên ngân hàng SangLe"
// }

const getTokenByPartner = async (req, res, next) => {
  try {
    const { id, code, name, password } = req.body;
    if (!id || !code || !name || !password) {
      return next(createErrors(400, 'Params is not valid'));
    }
    const token = await generatePartnerCode({
      id: id,
      code: code,
      name: name,
      password: password,
    });
    return res.status(200).send({
      token: token,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  getAccountProfile,
  getTokenByPartner,
  payin,
};
