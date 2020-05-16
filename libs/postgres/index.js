const Sequelize = require('sequelize');
const { DatabaseConnectionError } = require('@sgjobfit/common');
const logger = require('../../utils/logger');

const db = new Sequelize(
  process.env.PSQL_DATABASE,
  process.env.PSQL_USERNAME,
  process.env.PSQL_PASSWORD,
  {
    host: process.env.PSQL_HOST,
    dialect: process.env.PSQL_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

db.authenticate()
  .then(() => logger.info('Database connected'))
  .catch(err => {
    logger.info(err);
    throw new DatabaseConnectionError();
  });

module.exports = db;
