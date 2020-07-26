const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../config');

bluebird.promisifyAll(redis.RedisClient.prototype);

const redisClient = redis.createClient({
  port: config.redis.port,
  host: config.redis.host,
});

(async () => {
  const resp = await redisClient.authAsync(config.redis.password);
  console.log('Redis connection: ', resp);
})();

module.exports = {
  redisClient,
};
