/* eslint-disable import/no-dynamic-require */
/* eslint global-require: 0 */

const envFound = require('dotenv').config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const defaultConfig = {
  port: process.env.PORT || 5000,
  postgresSQL: {
    host: process.env.PSQL_HOST || 'internet-banking.cgz7dwdib785.us-east-2.rds.amazonaws.com',
    port: process.env.PSQL_PORT || 5432,
    database: process.env.PSQL_DATABASE || 'postgres',
    username: process.env.PSQL_USERNAME || 'postgres',
    password: process.env.PSQL_PASSWORD || 'Duyquang!2006',
    dialect: 'postgres',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis-12222.c10.us-east-1-3.ec2.cloud.redislabs.com',
    port: process.env.REDIS_PORT || 12222,
    password: process.env.REDIS_PASSWORD || 'jobfit2020',
  },
  transaction: {
    fee: 1000,
  },
};

const getConfig = env => {
  const envConfig = require(`./${env}`);
  return Object.assign(defaultConfig, envConfig);
};

module.exports = getConfig(process.env.NODE_ENV);
