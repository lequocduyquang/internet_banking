/* eslint-disable no-param-reassign */
const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../libs/postgres');

const Admin = db.define(
  'Admin',
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
    tableName: 'admin',
    timestamps: false,
  }
);

Admin.beforeCreate(async (admin, options) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(admin.password, salt);
  admin.password = hashedPassword;
});

sequelizePaginate.paginate(Admin);

module.exports = Admin;
