// const http = require('http');
// const socketIO = require('socket.io');

// const ioServer = app => {
//   const expressServer = http.Server(app);
//   const io = socketIO(expressServer, {
//     pingInterval: 5000,
//     pingTimeout: 25000,
//   });

//   io.on('connection', socket => {
//     console.log('User connected with socket id ', socket.id);
//     socket.on('disconnect', () => {
//       console.log('Sockets disconnected.');
//     });
//   });
//   return expressServer;
// };

// module.exports = {
//   ioServer,
// };
