const { createLogger, format, transports } = require('winston');

const LOG_LEVEL = process.env.LOG_LEVEL || 'verbose';

/* eslint no-param-reassign: "error" */
const InternetBanking = format.printf(info => {
  info.severity = info.level;
  return info;
});

const logger = createLogger({
  format: format.combine(
    InternetBanking,
    format.timestamp({
      format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ",
    }),
    format.json()
  ),
  level: LOG_LEVEL,
  transports: [new transports.Console({ level: LOG_LEVEL })],
});

module.exports = logger;
