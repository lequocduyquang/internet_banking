const Bull = require('bull');
const { NOTI_DEBIT_QUEUE, REDIS_URL } = require('../constants/queue');
const logger = require('../utils/logger');

const notiDebitQueue = new Bull(NOTI_DEBIT_QUEUE, REDIS_URL);
console.log('Queue: ', notiDebitQueue);
logger.info('Start consumer debit ...');

const sendNoti = async data => {
  console.log('Data: ', data);
};

const consume = async () => {
  console.log('123');
  notiDebitQueue.process(async job => {
    console.log('Job: ', job);
    await sendNoti(job.data);
  });
};

consume();
