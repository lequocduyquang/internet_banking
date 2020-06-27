const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const { ErrorCode } = require('./constants/ErrorCode');
const logger = require('./utils/logger');
require('express-async-errors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.get('/health', (req, res) => {
  res.send('Welcome to Internet Banking API');
});
// app.set('io', io);

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
const server = app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
const io = socketIO(server);

io.on('connection', socket => {
  console.log('User connected with socket id ', socket.id);
  socket.on('disconnect', () => {
    console.log('Sockets disconnected.');
  });
});

module.exports = app;
