const createErrors = require('http-errors');
const logger = require('../utils/logger');
const debitService = require('../services/debit.service');

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
    const { id } = req.user;
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

module.exports = {
  getAllDebits,
  createDebit,
};
