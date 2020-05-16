/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const defaultConfig = {
  tokenSecretKey: process.env.TOKEN_SECRET_KEY || '1nternetB@nk1ng',
  port: process.env.PORT || 5000,
};

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = require(`./${env}`);
  return Object.assign(defaultConfig, envConfig);
};

module.exports = getConfig(process.env.NODE_ENV);
