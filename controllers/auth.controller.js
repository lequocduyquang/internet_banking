const { BadRequestError } = require('@sgjobfit/common');
const models = require('../models');

const sendTokenResponse = async (user, res) => {
  // Create token
  const accessToken = await user.getAccessToken();
  const refreshToken = await user.getRefreshToken();
  res.status(200).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};

const registerEmployee = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existedEmployee = await models.Employee.findOne({
      where: { email: email },
    });
    if (existedEmployee) {
      throw new BadRequestError('Employee is already exists');
    }

    const employee = await models.Employee.create({
      username: username,
      email: email,
      password: password,
    });
    res.status(201).send({
      employee_created: employee,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const checkUser = await models.Admin.findOne({
      where: { email: email },
    });
    if (checkUser) {
      throw new BadRequestError('Admin is alreay exists');
    }

    const admin = await models.Admin.create({
      username,
      email,
      password,
    });

    res.status(201).send({
      admin_created: admin,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const registerCustomer = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body;
    const checkUser = await models.Customer.findOne({
      where: { phone: phone },
    });
    if (checkUser) {
      throw new BadRequestError('Customer is alreay exists');
    }

    const customer = await models.Customer.create({
      username,
      email,
      password,
      phone,
    });

    res.status(201).send({
      customer_created: customer,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check for user
    const employee = await models.Employee.findOne({
      where: { email: email },
    });
    if (!employee) {
      throw new BadRequestError('Account is not exists');
    }
    // Check if password matches
    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      throw new BadRequestError('Password not match');
    }
    await sendTokenResponse(employee, res);
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check for user
    const admin = await models.Admin.findOne({
      where: { email: email },
    });
    if (!admin) {
      throw new BadRequestError('Account is not exists');
    }
    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      throw new BadRequestError('Password not match');
    }
    await sendTokenResponse(admin, res);
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check for user
    const customer = await models.Customer.findOne({
      where: { email: email },
    });
    if (!customer) {
      throw new BadRequestError('Account is not exists');
    }
    // Check if password matches
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      throw new BadRequestError('Password not match');
    }
    await sendTokenResponse(customer, res);
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const getEmployeeProfile = async (req, res, next) => {
  try {
    const foundEmployee = await models.Employee.findOne({
      where: {
        email: req.user.email,
      },
    });
    if (!foundEmployee) {
      throw new BadRequestError('Employee with this email is not exists');
    }
    res.status(200).send({
      profile: foundEmployee,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const foundAdmin = await models.Admin.findOne({
      where: {
        email: req.user.email,
      },
    });
    if (!foundAdmin) {
      throw new BadRequestError('Admin with this email is not exists');
    }
    res.status(200).send({
      profile: foundAdmin,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

const getCustomerProfile = async (req, res, next) => {
  try {
    const foundCustomer = await models.Customer.findOne({
      where: {
        email: req.user.email,
      },
    });
    if (!foundCustomer) {
      throw new BadRequestError('Customer with this email is not exists');
    }
    res.status(200).send({
      profile: foundCustomer,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
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
