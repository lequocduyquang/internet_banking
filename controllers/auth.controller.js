const { BadRequestError } = require('@sgjobfit/common');
const Employee = require('../models/employee.model');
const Admin = require('../models/admin.model');

const registerEmployee = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existedEmployee = await Employee.findOne({
      email,
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
      email,
    });
    if (checkUser) {
      throw new BadRequestError('Admin is alreay exists');
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      role_id: 1,
    });

    res.status(201).send({
      admin_created: admin,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

module.exports = {
  registerEmployee,
  registerAdmin,
};
