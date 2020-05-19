/* eslint-disable no-param-reassign */
const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../libs/postgres');

const Employee = db.define(
  'Employee',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    updated_at: Sequelize.DATE,
    created_at: Sequelize.DATE,
  },
  {
    tableName: 'employee',
    timestamps: false,
  }
);

Employee.beforeCreate(async (employee, options) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(employee.password, salt);
  employee.password = hashedPassword;
});

Employee.prototype.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    return console.log(error);
  }
};

Employee.prototype.getAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      username: this.username,
      email: this.email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    }
  );
};

Employee.prototype.getRefreshToken = function () {
  return jwt.sign(
    {
      id: this.id,
      username: this.username,
      email: this.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );
};

sequelizePaginate.paginate(Employee);

module.exports = Employee;
