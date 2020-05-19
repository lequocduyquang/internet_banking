const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const db = require('../libs/postgres');
const TransactionLog = require('./transaction_log.model');

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

TransactionType.associate = () => {
  TransactionType.hasMany(TransactionLog, { foreignKey: 'transaction_type' });
};

module.exports = TransactionType;
