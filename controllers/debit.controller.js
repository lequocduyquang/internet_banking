const createErrors = require('http-errors');
const _ = require('lodash');
const logger = require('../utils/logger');
const debitService = require('../services/debit.service');
const { redisClient } = require('../libs/redis');
const models = require('../models');

const { Debit } = models;

const getAllDebits = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await debitService.getAllDebits(id);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      debits: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const createDebit = async (req, res, next) => {
  try {
    const { id, username } = req.user;
    const { io } = req;
    redisClient.hgetall('socketIds', (err, result) => {
      console.log('Create debit: ', result[`Customer|${id}`]);
      io.to(result[`Customer|${req.body.reminder_id}`]).emit(
        'debitNoti',
        `Thông báo nhắc nợ từ user ${username}. Số tiền là: ${req.body.amount}`
      );
    });
    const result = await debitService.create(id, req.body);
    return res.status(200).json({
      message: 'Success',
      data: result.data,
    });
  } catch (error) {
    logger.error(`Create debit error: ${error}`);
    return next(createErrors(400, error.message));
  }
};

const deleteDebit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { io } = req;
    const foundDebit = await Debit.findOne({
      where: {
        id: id,
      },
    });
    if (_.isEmpty(foundDebit)) {
      return res.status(400).send({
        message: 'Debit not found',
      });
    }
    redisClient.hgetall('socketIds', (err, result) => {
      console.log('Result: ', result[`Customer|${id}`]);
      io.to(result[`Customer|${foundDebit.reminder_id}`]).emit(
        'deletDebitNoti',
        `Thông báo xóa nhắc nợ từ user ${req.user.username}`
      );
    });
    foundDebit.setDataValue('is_actived', false);
    await foundDebit.save();
    return res.status(200).json({
      message: 'Hủy nhắc nợ thành công',
    });
  } catch (error) {
    logger.error('Error: ', error);
    return next(createErrors(400, error.message));
  }
};

const payDebit = async (req, res, next) => {
  try {
    const debitId = req.body;
    const customer = req.user;
    const debitVal = await debitService.paid({ customer, debitId });
    return res.status(200).send({
      message: 'Paid debit',
      data: debitVal,
    });
  } catch (error) {
    logger.error('Error: ', error);
    return next(createErrors(400, error.message));
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { OTP } = req.body;
    const { io } = req;

    const paidDebit = await debitService.verifyOTP({ OTP });
    if (paidDebit.error) {
      return next(createErrors(400, paidDebit.error.message));
    }
    /** Send thêm noti sau khi đã debit */
    redisClient.hgetall('socketIds', (err, result) => {
      console.log('Result: ', result[`Customer|${paidDebit.reminder_id}`]);
      io.to(result[`Customer|${paidDebit.creator_customer_id}`]).emit(
        'deletDebitNoti',
        `Thông báo đã thanh toán nhắc nợ từ user ${req.user.username}`
      );
    });
    return res.status(200).send({
      valid: paidDebit,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const verifyContact = async (req, res, next) => {
  try {
    const { account_number: accountNumber } = req.body;
    const result = await debitService.verifyContact(accountNumber);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      customer: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  getAllDebits,
  createDebit,
  deleteDebit,
  payDebit,
  verifyOTP,
  verifyContact,
};
