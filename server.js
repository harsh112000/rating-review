// eslint-disable-next-line import/no-extraneous-dependencies
/* eslint-disable no-process-exit */
require('./scheduler/clear-logs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const correlationId = require('correlationid-middleware');
const SmartHttp = require('smart-http');
const expressWinston = require('express-winston');
const winston = require('winston');
const Sequelize = require('sequelize');
const {
  username, password, database, host, dialect, port,
} = require('./database/config/config');
const adminRoutes = require('./routes/user/admin/authentication');
const customerRoutes = require('./routes/user/customer/authentication');

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port,
});

const routes = require('./routes');
const logger = require('./logger/logger');
const { PORT } = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(cors({
  exposedHeaders: [ 'x-coreplatform-paging-limit', 'x-coreplatform-total-records', 'public-id', 'image-url', 'message' ],
}));
app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(correlationId, SmartHttp());
app.use((req, _res, next) => {
  logger.info(`Route accessed: ${req.method} ${req.url}`);
  next();
});
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
}));
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
  ],
}));

app.use('/', routes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/customer', customerRoutes);
app.all('/*', (_req, res) => res.notFound());

try {
  sequelize.sync({ force: false /* models: [ ] */ })
    .then(() => {
      logger.info('Database synchronized');
      const server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });

      process.on('SIGINT', () => {
        logger.info('Received SIGINT, shutting down gracefully');
        server.close(() => {
          logger.info('Server shut down');
          sequelize.close();
          process.exit(0);
        });
      });
    })
    .catch((error) => {
      logger.error('Error synchronizing database:', error);
      process.exit(1);
    });

  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled promise rejection: ${err}`);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully');
    process.exit(0);
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err}`);
    process.exit(1);
  });

  process.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use`);
    } else {
      logger.error(`Error occurred: ${error}`);
    }
    process.exit(1);
  });
} catch (error) {
  logger.error('An error occurred during server setup:', error);
  process.exit(1);
}
