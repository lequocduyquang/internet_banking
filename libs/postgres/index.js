const Sequelize = require('sequelize');
const { postgresSQL } = require('../../config');
const logger = require('../../utils/logger');

const { host, database, username, password, dialect } = postgresSQL;

const db = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db.authenticate()
  .then(() => logger.info('Database connected'))
  .catch(err => logger.info(err));

module.exports = db;
