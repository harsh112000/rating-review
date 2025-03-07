const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const cron = require('cron');
const logger = require('../logger/logger');

const newRelicFilePath = path.join(__dirname, '../../newrelic_agent.log');
const logFilePath = path.join(__dirname, '../loggings/combined.log');

const clearLogFile = (filePath) => new Promise((resolve, reject) => {
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      logger.error(`Error clearing log file ${filePath}`, err);
      reject(err);
    } else {
      logger.info(`Log file ${filePath} cleared.`);
      resolve();
    }
  });
});

const clearAllLogs = async () => {
  try {
    await clearLogFile(newRelicFilePath);
    await clearLogFile(logFilePath);
    logger.info('All specified log files cleared.');
  } catch (error) {
    logger.error('Error clearing one or more log files:', error);
  }
};

// Run cron job every 24 hr to clear log files
const job = new cron.CronJob('* */24 * * *', () => {
  logger.info('Running cron job to clear log files');
  clearAllLogs();
});

job.start();

logger.info('Cron job scheduled to clear logs every 24 hr.');

module.exports = job;
