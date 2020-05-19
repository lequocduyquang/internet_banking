const { BadRequestError } = require('@sgjobfit/common');
const Employee = require('../models/employee.model');
const Admin = require('../models/admin.model');
const Customer = require('../models/customer.model');

const registerEmployee = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existedEmployee = await Employee.findOne({
      where: { email: email },
    });
    if (existedEmployee) {
      throw new BadRequestError('Employee is already exists');
    }

    const employee = await Employee.create({
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
    const checkUser = await Admin.findOne({
      where: { email: email },
    });
    if (checkUser) {
      throw new BadRequestError('Admin is alreay exists');
    }

    const admin = await Admin.create({
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
    const checkUser = await Admin.findOne({
      where: { phone: phone },
    });
    if (checkUser) {
      throw new BadRequestError('Customer is alreay exists');
    }

    const customer = await Customer.create({
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

module.exports = {
  registerEmployee,
  registerAdmin,
  registerCustomer,
};
