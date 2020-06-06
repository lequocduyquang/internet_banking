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

    /**
     * Thiếu ghi vào bảng Transaction Log
     *
     *
     *
     */
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
    const { account_number: accountNumber } = req.params;
    let condition = {};
    if (!accountNumber) {
      throw new BadRequestError('Customer is not exists');
    }
    if (req.query.isReceive) {
      condition = { ...condition, receiver_account_number: accountNumber };
    }
    if (req.query.isSender) {
      condition = { ...condition, sender_account_number: accountNumber };
    }
    if (req.query.isBeRemind) {
      condition = { ...condition, transaction_type: 3, sender_account_number: accountNumber };
    }
    if (req.query.isRemind) {
      if (req.query.isBeRemind) {
        condition = { ...condition, transaction_type: 3, receiver_account_number: accountNumber };
      }
    }
    if (req.query.all) {
      condition = {
        ...condition,
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
        },
      };
    }
    const history = await models.TransactionLog.findAll({
      where: condition,
      order: [['updated_at', 'DESC']],
    });

    console.log(history);
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
