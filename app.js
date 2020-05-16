const express = require('express');
const morgan = require('morgan');
const { NotFoundError, errorHandler, currentUser } = require('@sgjobfit/common');
const config = require('./config');
const logger = require('./utils/logger');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('express-async-errors');

app.use(morgan('dev'));

app.use(currentUser);
app.all('*', (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

const PORT = config.port || 5000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

module.exports = app;
