const _ = require('lodash');
const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');
const models = require('../models');

const { Employee } = models;

const getAllEmployee = async (paginationOpts = {}) => {
  try {
    const employees = await Employee.paginate({
      attributes: { exclude: ['password'] },
      ...paginationOpts,
    });
    if (_.isNil(employees)) {
      return {
        error: new Error(ErrorCode.EMPLOYEES_NOT_FOUND),
      };
    }
    return {
      employees,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getEmployee = async (id, paginationOpts = {}) => {
  try {
    const employee = await Employee.paginate({
      where: {
        id: id,
      },
      attributes: { exclude: ['password'] },
      ...paginationOpts,
    });
    if (_.isNil(employee)) {
      return {
        error: new Error(ErrorCode.EMPLOYEE_INFO_NOT_FOUND),
      };
    }
    return {
      employee,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const createEmployee = async ({ username, email, password }) => {
  try {
    const isExistedUser = await Employee.findOne({
      where: {
        email: email,
      },
    });
    if (isExistedUser) {
      logger.info(`POSTGRES: ${ErrorCode.EMPLOYEE_EMAIL_IS_EXIST}`);
      return {
        error: new Error(ErrorCode.COMPANY_EMAIL_IS_EXIST),
      };
    }
    const employee = await Employee.create({ username, password, email });
    return {
      data: employee,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const deleteEmployee = async id => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ['password'] },
    });
    if (_.isNil(employee)) {
      return {
        error: new Error(ErrorCode.EMPLOYEE_INFO_NOT_FOUND),
      };
    }
    employee.setDataValue('status', 0);
    await employee.save();
    return {
      data: employee,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  getAllEmployee,
  getEmployee,
  createEmployee,
  deleteEmployee,
};
