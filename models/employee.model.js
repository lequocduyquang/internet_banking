const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
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
    address: Sequelize.STRING,
    updated_at: Sequelize.DATE,
    created_at: Sequelize.DATE,
  },
  {
    tableName: 'comployee',
    timestamps: false,
  }
);

sequelizePaginate.paginate(Employee);

module.exports = Employee;
