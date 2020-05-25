const { BadRequestError } = require('@sgjobfit/common');
const { Op } = require('sequelize');
const models = require('../models');

const createCustomer = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existedCustomer = await models.Customter.findOne({
      where: { email: email },
    });
    if (existedCustomer) {
      throw new BadRequestError('Customer is not exists');
    }

    const customter = await models.Customter.create({
      username: username,
      email: email,
      password: password,
    });
    res.status(201).send({
      customer_created: customter,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const chargeCustomer = async (req, res, next) => {
  try {
    const { account_number: accountNumber, amount } = req.body;
    const existedCustomer = await models.Customter.findOne({
      where: { account_number: accountNumber },
    });
    if (existedCustomer) {
      throw new BadRequestError('Customer is not exists');
    }

    const customter = await models.Customter.update(
      { account_balance: +amount },
      {
        where: {
          account_number: accountNumber,
        },
      }
    );
    res.status(200).send({
      message: 'Success',
      data: customter,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const getTransactionLog = async (req, res, next) => {
  try {
    const accountNumber = req.params.account_number;
    if (!accountNumber) {
      throw new BadRequestError('Customer is not exists');
    }
    const history = await models.TransactionLog.find({
      where: {
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
        },
      },
    });
    res.status(200).send({
      message: 'Success',
      data: history,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

module.exports = {
  createCustomer,
  chargeCustomer,
  getTransactionLog,
};
