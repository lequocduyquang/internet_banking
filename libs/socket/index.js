const jwt = require('jsonwebtoken');

const initSocket = socket => {
  socket.on('init', accessToken => {
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
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
