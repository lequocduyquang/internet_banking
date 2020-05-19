/* eslint-disable no-param-reassign */
const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
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

sequelizePaginate.paginate(Employee);

module.exports = Employee;
