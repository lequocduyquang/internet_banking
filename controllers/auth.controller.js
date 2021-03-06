const createErrors = require('http-errors');
const authService = require('../services/auth.service');

const registerEmployee = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.registerEmployee({
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

const registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.registerAdmin({
      username,
      email,
      password,
    });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).json({
      success: true,
      admin: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const registerCustomer = async (req, res, next) => {
  try {
    const { username, email, password, phone, fullname } = req.body;
    const result = await authService.registerCustomer({
      username,
      email,
      password,
      phone,
      fullname,
    });
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

const loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginEmployee({ email, password });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      success: true,
      employee: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginAdmin({ email, password });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      success: true,
      admin: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginCustomer({ email, password });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      success: true,
      customer: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const getEmployeeProfile = async (req, res, next) => {
  try {
    const { email } = req.user;
    const result = await authService.getEmployeeProfile(email);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      profile: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const { email } = req.user;
    const result = await authService.getAdminProfile(email);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      profile: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const getCustomerProfile = async (req, res, next) => {
  try {
    const { email } = req.user;
    const result = await authService.getCustomerProfile(email);
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      profile: result.data,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const updatePasswordCustomer = async (req, res, next) => {
  try {
    const { email, id } = req.user;
    const { currentPassword, newPassword } = req.body;
    const result = await authService.updatePassword(
      { currentPassword, newPassword },
      { email, id }
    );
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const forgotPasswordCustomer = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.sendEmailCustomer({ email });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      result,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { OTP, email } = req.body;
    const result = await authService.verifyOTP({ OTP, email });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      valid: result.isValid,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const resetPasswordCustomer = async (req, res, next) => {
  const { newPassword, email } = req.body;
  try {
    const result = await authService.reset({ newPassword, email });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      user: result.user,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(createErrors(400, 'INVALID_REFRESH_TOKEN'));
    }
    const result = await authService.refresh({ refreshToken });
    if (result.error) {
      return next(createErrors(400, result.error.message));
    }
    return res.status(200).send({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    return next(createErrors(400, error.message));
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
  updatePasswordCustomer,
  forgotPasswordCustomer,
  resetPasswordCustomer,
  verifyOTP,
  refresh,
};
