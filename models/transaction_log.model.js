const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const db = require('../libs/postgres');

const TransactionLog = db.define(
  'TransactionLog',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_type: Sequelize.INTEGER,
    transaction_method: Sequelize.INTEGER,
    is_actived: Sequelize.BOOLEAN,
    is_notified: Sequelize.BOOLEAN,
    sender_account_number: Sequelize.STRING,
    receiver_account_number: Sequelize.STRING,
    amount: Sequelize.DOUBLE,
    message: Sequelize.STRING,
    partner_code: Sequelize.STRING,
    updated_at: Sequelize.DATE,
    created_at: Sequelize.DATE,
  },
  {
    tableName: 'transaction_log',
    timestamps: false,
  }
);

sequelizePaginate.paginate(TransactionLog);

module.exports = TransactionLog;
