const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../config/config');

bluebird.promisifyAll(redis.RedisClient.prototype);

console.log('Redis config: ', config.redis);

const redisClient = redis.createClient({
  port: config.redis.port,
  host: config.redis.host,
});

(async () => {
  const resp = await redisClient.authAsync(config.redis.password);
  console.log('Response: ', resp);
})();

module.exports = {
  redisClient,
};
