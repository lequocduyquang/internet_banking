const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const http = require('http');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { ErrorCode } = require('./constants/ErrorCode');
const logger = require('./utils/logger');
require('express-async-errors');
const { initSocket } = require('./libs/socket');

dotenv.config();

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(morgan('dev'));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
io.on('connection', socket => {
  console.log('Socket ID: ', socket.id);
  initSocket(socket);
  socket.on('disconnect', function () {
    console.log('Sockets disconnected.');
  });
});

app.use(limiter);

require('./middleware/docs')(app);

app.get('/health', (req, res) => {
  res.send('Welcome to Internet Banking API');
});

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/partner', require('./routes/partner'));
app.use('/api/v1/transaction', require('./routes/transaction'));
app.use('/api/v1/employee', require('./routes/employee'));
app.use('/api/v1/customer', require('./routes/customer'));
app.use('/api/v1/admin', require('./routes/admin'));

app.get('/test', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(function (err, req, res, next) {
  const statusCode = err.status || 500;
  if (statusCode === 500) {
    res.status(statusCode).send({
      errors: [{ message: ErrorCode.INTERNAL_SERVER_ERROR }],
    });
  }
  res.status(statusCode).send({
    errors: [{ message: `${err.message}` }],
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

module.exports = app;
