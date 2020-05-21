require('dotenv').config();

module.exports = {
  development: {
    database: process.env.PSQL_DATABASE,
    username: process.env.PSQL_USERNAME,
    password: process.env.PSQL_PASSWORD,
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    dialect: process.env.PSQL_DIALECT,
  },
  test: {
    url: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/test_db',
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
};
