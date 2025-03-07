const path = require('path');
const winston = require('winston');

const logDirectory = path.join(__dirname, '..', 'loggings');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => JSON.stringify({
      level,
      timestamp,
      msg: typeof message === 'string' ? message : message.text || 'N/A',
    })),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDirectory, 'combined.log') }),
  ],
});

module.exports = logger;
