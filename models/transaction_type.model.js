const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const db = require('../libs/postgres');

const TransactionType = db.define(
  'TransactionType',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: Sequelize.STRING,
  },
  {
    tableName: 'transaction_type',
    timestamps: false,
  }
);

sequelizePaginate.paginate(TransactionType);

module.exports = TransactionType;
