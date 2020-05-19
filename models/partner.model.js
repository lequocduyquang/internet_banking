const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const db = require('../libs/postgres');

const Partner = db.define(
  'Partner',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    updated_at: Sequelize.DATE,
    created_at: Sequelize.DATE,
  },
  {
    tableName: 'partner',
    timestamps: false,
  }
);

sequelizePaginate.paginate(Partner);

module.exports = Partner;
