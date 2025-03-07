// eslint-disable-next-line import/no-extraneous-dependencies
const UAParser = require('ua-parser-js');
const { test: TestModel } = require('../../../database');
const getPreviousData = require('./get-previous');
const logger = require('../../../logger/logger');

const requestLogger = async (req, res, next) => {
  const userId = req.user ? req.user.adminId : null;
  const currentData = req.body;
  let previousData = {};
  let changes = {};

  let model;
  let modelName;

  // For reference only
  if (req.originalUrl.includes('/test')) {
    model = TestModel;
    modelName = 'Test';
  }

  logger.info(`Model selected: ${model ? model.name : 'No model selected'}`);
  logger.info(`Request method: ${req.method}`);
  const paramId = Object.values(req.params)[0];
  const userAgent = req.headers['user-agent'];
  const parser = new UAParser();

  const result = parser.setUA(userAgent).getResult();

  const deviceType = result.device.type === 'mobile' ? 'Mobile' : 'Desktop';

  if ((req.method === 'PATCH' || req.method === 'POST') && model && paramId) {
    try {
      previousData = await getPreviousData(model, paramId);

      changes = Object.keys(currentData).reduce((acc, key) => {
        // eslint-disable-next-line eqeqeq
        if (currentData[key] != previousData[key]) {
          acc[key] = `${previousData[key]} => ${currentData[key]}`;
        }

        return acc;
      }, {});
    } catch (err) {
      logger.error('Error comparing data:', err);
    }
  }

  res.on('finish', async () => {
    if (res.statusCode === 201 || res.statusCode === 204) {
      const data = {
        actionBy: 'Admin',
        actionType: req.method === 'PATCH' ? 'Update' : 'Create',
        actionById: userId,
        actionByName: `${req.user.firstName} ${req.user.lastName}`,
        method: req.method,
        actionOn: modelName || null,
        actionOnId: req.method === 'POST' ? res.locals.id : paramId,
        apiEndpoint: req.originalUrl,
        payload: JSON.stringify(currentData),
        changes,
        deviceType,
        ip: req.headers['x-forwarded-for'],
        browser: userAgent,
        status: (res.statusCode === 201 || res.statusCode === 204) ? 1 : 0,
      };

      logger.info(data);

      try {
        const actionLog = await ActionLogModel.create(data);

        if (!actionLog) {
          logger.error('Error creating action log');
        } else {
          logger.info('Action log created successfully');
        }
      } catch (error) {
        logger.error('Database error creating action log:', error);
      }
    }
  });
  next();
};

module.exports = requestLogger;
