const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../config/config');

bluebird.promisifyAll(redis.RedisClient.prototype);

const redisClient = redis.createClient({
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password,
});

module.exports = {
  redisClient,
};
