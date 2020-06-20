const Bull = require('bull');
const { NOTI_DEBIT_QUEUE, REDIS_URL } = require('../constants/queue');
const logger = require('../utils/logger');
const { sendMail } = require('../utils/mailer');

const notiDebitQueue = new Bull(NOTI_DEBIT_QUEUE, REDIS_URL);

logger.info('Start consumer debit ...');

const consume = () => {
  notiDebitQueue.process(async job => {
    const message = `<p>${job.data}</p>`;
    // eslint-disable-next-line no-return-await
    return await sendMail('duyquangbtx@gmail.com', message);
  });
};

consume();
