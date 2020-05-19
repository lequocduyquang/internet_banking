/* eslint-disable no-param-reassign */
const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
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

Admin.prototype.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    return console.log(error);
  }
};

Admin.prototype.getAccessToken = function () {
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

Admin.prototype.getRefreshToken = function () {
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

sequelizePaginate.paginate(Admin);

module.exports = Admin;
