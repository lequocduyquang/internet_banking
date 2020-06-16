const Bull = require('bull');
const axios = require('axios');
const logger = require('../utils/logger');

const debitQueue = new Bull('DEBIT_QUEUE', 'http://localhost:6309');

logger.info('Start consumer debit ...');

const sendNoti = async () => {};

const consume = async () => {
  debitQueue.process(async job => {
    await sendNoti(job.data);
  });
};

consume();
