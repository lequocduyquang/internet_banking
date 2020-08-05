const createErrors = require('http-errors');
const _ = require('lodash');
const logger = require('../utils/logger');
const debitService = require('../services/debit.service');
const { redisClient } = require('../libs/redis');
const models = require('../models');
const { buildPaginationOpts, decoratePaginatedResult } = require('../utils/paginate');
const { sendMail } = require('../utils/mailer');

const { Debit, Customer } = models;

const getAllDebits = async (req, res, next) => {
  try {
    const { id } = req.user;
    const paginateOpts = buildPaginationOpts(req);
    const result = await debitService.getAllDebits(id);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send(decoratePaginatedResult(result.data, paginateOpts));
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const createDebit = async (req, res, next) => {
  try {
    const { id, username } = req.user;
    const { io } = req;
    const reminder = await Customer.findOne({
      where: {
        account_number: req.body.account_number,
      },
    });
    redisClient.hgetall('socketIds', (err, result) => {
      console.log('Create debit: ', result[`Customer|${id}`]);
      io.to(result[`Customer|${reminder.id}`]).emit(
        'debitNoti',
        `Thông báo nhắc nợ từ user ${username}. Số tiền là: ${req.body.amount}`
      );
    });
    const result = await debitService.create(id, reminder, req.body);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
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
    // 1. Nhắc nợ được hủy từ người tạo
    const isCreator = await Debit.findOne({
      where: {
        creator_customer_id: req.user.id,
      },
    });
    if (!_.isEmpty(isCreator)) {
      redisClient.hgetall('socketIds', (err, result) => {
        console.log('Xóa nhắc nợ từ người tạo: ', result[`Customer|${foundDebit.reminder_id}`]);
        io.to(result[`Customer|${foundDebit.reminder_id}`]).emit(
          'deletDebitNoti',
          `Thông báo xóa nhắc nợ từ user ${req.user.username}`
        );
      });
    } else {
      redisClient.hgetall('socketIds', (err, result) => {
        console.log(
          'Xóa nhắc nợ từ người bị nhắc: ',
          result[`Customer|${foundDebit.creator_customer_id}`]
        );
        io.to(result[`Customer|${foundDebit.creator_customer_id}`]).emit(
          'deletDebitNoti',
          `Thông báo xóa nhắc nợ từ user ${req.user.username}`
        );
      });
    }
    const reminder = await Customer.findOne({
      where: {
        id: foundDebit.reminder_id,
      },
    });
    foundDebit.setDataValue('is_actived', 0);
    await foundDebit.save();
    const emailContent = `
      <p>Thông báo nhắc nợ đã được hủy từ ${req.user.username}</p>
    `;
    sendMail(reminder.email, emailContent);
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
        'payDebitNoti',
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
    const foundOwner = await Customer.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!foundOwner) {
      logger.info('Account owner is not valid');
      return {
        error: new Error('Account owner is not valid'),
      };
    }
    const foundContactList = foundOwner.list_contact.find(
      item => item.account_number === accountNumber
    );
    if (foundContactList) {
      console.log('Get from contact list');
      return res.status(200).send({
        message: 'Success',
        data: foundContactList,
      });
    }
    const foundBeReminder = await Customer.findOne({
      where: {
        account_number: accountNumber,
      },
      attributes: ['username', 'account_number', 'email', 'phone', 'address'],
    });
    return res.status(200).send({
      message: 'Success',
      data: foundBeReminder,
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
