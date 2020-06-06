/* eslint-disable no-param-reassign */
const sequelizePaginate = require('sequelize-paginate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataTypes.STRING,
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      account_number: DataTypes.STRING,
      account_balance: DataTypes.FLOAT,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      list_contact: DataTypes.ARRAY(DataTypes.JSON), // JSON = { STK: string, name_remind: string }
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE,
    },
    {
      tableName: 'customer',
      timestamps: false,
    }
  );

  Customer.beforeCreate(async (customer, options) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(customer.password, salt);
    customer.password = hashedPassword;
  });

  Customer.prototype.matchPassword = async function (enteredPassword) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      return console.log(error);
    }
  };

  Customer.prototype.getAccessToken = function () {
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

  Customer.prototype.getRefreshToken = function () {
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

  Customer.prototype.updateBalance = function (amount, fee) {
    const customer = this;
    return new Promise(resolve => {
      customer.account_balance += amount - fee;
      resolve(customer);
    });
  };

  Customer.associate = models => {
    Customer.hasMany(models.Debits, { foreignKey: 'creator_customer_id' });
    Customer.hasMany(models.Debits, { foreignKey: 'reminder_id' });
  };

  Customer.prototype.matchPassword = async function (enteredPassword) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      return console.log(error);
    }
  };

  Customer.prototype.getAccessToken = function () {
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

  Customer.prototype.getRefreshToken = function () {
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

  sequelizePaginate.paginate(Customer);
  return Customer;
};
