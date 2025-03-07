const NodeCache = require('node-cache');
const logger = require('../../logger/logger');

// logger.info('Testing logger functionality');

const cache = new NodeCache();

const cacheMiddleware = (ttl) => (req, res, next) => {
  const cacheKey = `${req.originalUrl}_${JSON.stringify(req.query)}`;

  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info(`Cache hit for ${cacheKey}`);

    return res.json(JSON.parse(cachedData));
  }

  logger.info(`Cache miss for ${cacheKey}`);

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    try {
      const formattedBody = JSON.stringify(body);

      cache.set(cacheKey, formattedBody, ttl);

      return originalJson(body);
    } catch (error) {
      logger.error('Error serializing response for cache:', error);

      return originalJson(body);
    }
  };

  next();
};

module.exports = cacheMiddleware;
