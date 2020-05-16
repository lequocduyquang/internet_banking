const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { NotFoundError, errorHandler, currentUser } = require('@sgjobfit/common');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require('express-async-errors');

app.use(morgan('dev'));

app.use(currentUser);
app.use('/api/v1/admin', require('./routes'));

app.all('*', (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

module.exports = app;
