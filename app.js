const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { NotFoundError, errorHandler } = require('@sgjobfit/common');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('express-async-errors');

app.use(morgan('dev'));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/partner', require('./routes/partner'));
app.use('/api/v1/transaction', require('./routes/transaction'));
app.use('/api/v1/employee', require('./routes/employee'));

app.all('*', (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

module.exports = app;
