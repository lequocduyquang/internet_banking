const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const db = require('../libs/postgres');

const Customer = db.define(
  'Customer',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    account_number: Sequelize.STRING,
    phone: Sequelize.STRING,
    address: Sequelize.STRING,
    updated_at: Sequelize.DATE,
    created_at: Sequelize.DATE,
  },
  {
    tableName: 'customer',
    timestamps: false,
  }
);

sequelizePaginate.paginate(Customer);

module.exports = Customer;
