const jwt = require('jsonwebtoken');
const { redisClient } = require('../redis');

const initSocket = socket => {
  socket.on('init', accessToken => {
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      console.log('socket.id', socket.id);

      redisClient.hset('socketIds', `Customer|${payload.id}`, socket.id);
      socket.emit('initSuccessful', {
        payload,
      });
    } catch (error) {
      console.error(`Something went wrong: ${error.message}`);
    }
  });
};

module.exports = {
  initSocket,
};
