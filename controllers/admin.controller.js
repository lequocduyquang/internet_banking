const createErrors = require('http-errors');
const _ = require('lodash');
const { Op } = require('sequelize');
const adminService = require('../services/admin.service');
const { buildPaginationOpts, decoratePaginatedResult } = require('../utils/paginate');

const getAllEmployee = async (req, res, next) => {
  try {
    const paginationOpts = buildPaginationOpts(req);
    const result = await adminService.getAllEmployee(paginationOpts);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send(decoratePaginatedResult(result.employees, paginationOpts));
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paginationOpts = buildPaginationOpts(req);
    const result = await adminService.getEmployee(id, paginationOpts);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send(decoratePaginatedResult(result.employee, paginationOpts));
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await adminService.createEmployee({
      username,
      email,
      password,
    });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      employee: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteEmployee(id);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      message: 'Delete successfullly',
      employee: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const unblockEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await adminService.unBlockEmployee(id);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      message: 'Unblock successfullly',
      employee: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const getAllTransaction = async (req, res, next) => {
  try {
    const { begin, end, partner } = req.query;
    const sort = {
      sortBy: req.query.sortBy || 'created_at',
      orderBy: req.query.orderBy || 'DESC',
    };
    const queryDate = () => {
      let result = null;
      if (begin && begin !== 'null') {
        result = {
          [Op.gte]: begin,
        };
      }
      if (end && end !== 'null') {
        result = {
          [Op.lte]: end,
        };
      }
      if (begin && begin !== 'null' && end && end !== 'null') {
        result = {
          [Op.gte]: begin,
          [Op.lte]: end,
        };
      }
      return result;
    };
    const query = _.omitBy(
      {
        created_at: queryDate(),
        partner_code: partner || null,
      },
      _.isNil
    );
    const paginationOpts = buildPaginationOpts(req);
    const result = await adminService.getAllTransaction(query, sort, paginationOpts);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      ...decoratePaginatedResult(result.data, paginationOpts),
      sum_amount: result.sum,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

module.exports = {
  getAllEmployee,
  getEmployee,
  createEmployee,
  deleteEmployee,
  unblockEmployee,
  getAllTransaction,
};
