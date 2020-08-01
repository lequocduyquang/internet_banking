/* eslint-disable no-param-reassign */
const sequelizePaginate = require('sequelize-paginate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    'Employee',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE,
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
  return Employee;
};
