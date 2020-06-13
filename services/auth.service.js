const _ = require('lodash');
const { Random } = require('random-js');
const models = require('../models');
const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');

const { Employee, Admin, Customer } = models;

const sendTokenResponse = async user => {
  // Create token
  const accessToken = await user.getAccessToken();
  const refreshToken = await user.getRefreshToken();
  return {
    user,
    accessToken,
    refreshToken,
  };
};

const registerEmployee = async ({ username, email, password }) => {
  try {
    const isExistedUser = await Employee.findOne({
      where: { email: email },
    });
    if (isExistedUser) {
      logger.info(`POSTGRES: ${ErrorCode.EMPLOYEE_EMAIL_IS_EXIST}`);
      return {
        error: new Error(ErrorCode.EMPLOYEE_EMAIL_IS_EXIST),
      };
    }
    const employee = await Employee.create({ username, password, email, status: 1 });
    return {
      data: employee,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const registerAdmin = async ({ username, email, password }) => {
  try {
    const isExistedUser = await Admin.findOne({
      where: { email: email },
    });
    if (isExistedUser) {
      logger.info(`POSTGRES: ${ErrorCode.ADMIN_EMAIL_IS_EXIST}`);
      return {
        error: new Error(ErrorCode.ADMIN_EMAIL_IS_EXIST),
      };
    }
    const admin = await Admin.create({ username, password, email });
    return {
      data: admin,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const registerCustomer = async ({ username, email, password, phone, fullname }) => {
  try {
    const isExistedUser = await Customer.findOne({
      where: { email: email },
    });
    if (isExistedUser) {
      logger.info(`POSTGRES: ${ErrorCode.CUSTOMER_EMAIL_IS_EXIST}`);
      return {
        error: new Error(ErrorCode.CUSTOMER_EMAIL_IS_EXIST),
      };
    }
    const customer = await Customer.create({
      username,
      email,
      password,
      phone,
      fullname,
      account_number: new Random().integer(1000000000, 9999999999),
      account_balance: 0,
      list_contact: [],
    });
    return {
      data: customer,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const loginEmployee = async ({ email, password }) => {
  try {
    const employee = await Employee.findOne({
      where: {
        email: email,
      },
    });
    if (!employee) {
      return {
        error: new Error('Employee email not found'),
      };
    }
    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      return {
        error: new Error(ErrorCode.PASSWORD_NOT_MATCH),
      };
    }
    return await sendTokenResponse(employee);
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const loginAdmin = async ({ email, password }) => {
  try {
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });
    if (!admin) {
      return {
        error: new Error('Admin email not found'),
      };
    }
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return {
        error: new Error(ErrorCode.PASSWORD_NOT_MATCH),
      };
    }
    return await sendTokenResponse(admin);
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const loginCustomer = async ({ email, password }) => {
  try {
    const customer = await Customer.findOne({
      where: {
        email: email,
      },
    });
    if (!customer) {
      return {
        error: new Error('Customer email not found'),
      };
    }
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return {
        error: new Error(ErrorCode.PASSWORD_NOT_MATCH),
      };
    }
    return await sendTokenResponse(customer);
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getEmployeeProfile = async email => {
  try {
    const employee = await Employee.findOne({
      where: {
        email: email,
      },
    });
    if (!employee) {
      return {
        error: new Error(ErrorCode.EMPLOYEE_INFO_NOT_FOUND),
      };
    }
    return {
      data: employee,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getAdminProfile = async email => {
  try {
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });
    if (!admin) {
      return {
        error: new Error(ErrorCode.ADMIN_INFO_NOT_FOUND),
      };
    }
    return {
      data: admin,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const getCustomerProfile = async email => {
  try {
    const customer = await Admin.findOne({
      where: {
        email: email,
      },
    });
    if (!customer) {
      return {
        error: new Error(ErrorCode.CUSTOMER_INFO_NOT_FOUND),
      };
    }
    return {
      data: customer,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

module.exports = {
  registerEmployee,
  registerAdmin,
  registerCustomer,
  loginEmployee,
  loginAdmin,
  loginCustomer,
  getEmployeeProfile,
  getAdminProfile,
  getCustomerProfile,
};
