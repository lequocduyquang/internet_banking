const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { Random } = require('random-js');
const bcrypt = require('bcryptjs');
const models = require('../models');
const { ErrorCode } = require('../constants/ErrorCode');
const logger = require('../utils/logger');
const { sendMail } = require('../utils/mailer');
const { redisClient } = require('../libs/redis');

const { Employee, Admin, Customer } = models;

const sendTokenResponse = async user => {
  // Create token
  const accessToken = await user.getAccessToken();
  const refreshToken = await user.getRefreshToken();
  await redisClient.setAsync(`RefreshToken:${user.email}`, refreshToken, 'EX', 604800);
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
    logger.error(`Register employee error: ${error.message}`);
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
    logger.error(`Register admin error: ${error.message}`);
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
    logger.error(`Register customer error: ${error.message}`);
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
        status: 1,
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
    logger.error(`Login employee error: ${error.message}`);
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
    logger.error(`Login admin error: ${error.message}`);
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
        status: 1,
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
    logger.error(`Login customer error: ${error.message}`);
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
    logger.error(`Get employee profile error: ${error.message}`);
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
    logger.error(`Get admin profile error: ${error.message}`);
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
    logger.error(`Get customer profile error: ${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const updatePassword = async ({ currentPassword, newPassword }, { email, id }) => {
  try {
    const customer = await Customer.findOne({
      where: {
        email: email,
      },
    });
    if (!customer) {
      return {
        error: new Error(ErrorCode.EMAIL_NOT_REGISTERED),
      };
    }
    // Check current password
    if (!(await customer.matchPassword(currentPassword))) {
      return {
        error: new Error(ErrorCode.PASSWORD_NOT_MATCH),
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    customer.setDataValue('password', hashedNewPassword);
    await customer.save();
    return await sendTokenResponse(customer);
  } catch (error) {
    logger.error(`Update password error: ${error.message}`);
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const sendEmailCustomer = async ({ email }) => {
  const user = await Customer.findOne({
    where: { email: email },
  });
  if (!user) {
    return {
      error: new Error(ErrorCode.EMAIL_NOT_REGISTERED),
    };
  }
  const OTPCode = new Random().integer(100000, 999999);
  await redisClient.setAsync(`OTP:${email}`, OTPCode, 'EX', 60 * 60); // Expired 1h

  const message = `
    <p>Forgot your password</p>
    <h4>
      Input your OTP code to reset your password
      <i>${OTPCode}</i>
    </h4>
  `;

  // eslint-disable-next-line no-return-await
  return await sendMail(user.email, message);
};

const verifyOTP = async ({ OTP, email }) => {
  try {
    const otpCode = await redisClient.getAsync(`OTP:${email}`);
    return {
      isValid: otpCode === OTP,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const reset = async ({ newPassword, email }) => {
  try {
    const customer = await Customer.findOne({
      where: {
        email: email,
      },
    });
    await customer.resetPassword(newPassword);
    return {
      user: customer,
    };
  } catch (error) {
    return {
      error: new Error(ErrorCode.SOMETHING_WENT_WRONG),
    };
  }
};

const refresh = async ({ refreshToken }) => {
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const cred = await redisClient.getAsync(`RefreshToken:${payload.email}`);
  if (refreshToken !== cred) {
    return {
      error: new Error(ErrorCode.INVALID_REFRESH_TOKEN),
    };
  }
  const user = await Customer.findOne({
    where: {
      id: payload.id,
    },
  });
  // Clear refresh token in redis
  await redisClient.delAsync(`RefreshToken:${payload.email}`);
  const data = await sendTokenResponse(user);
  return data;
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
  updatePassword,
  sendEmailCustomer,
  reset,
  verifyOTP,
  refresh,
};
