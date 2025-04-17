const logger = require("../config/logger.config");

// Middleware to log each request
const logRequest = (req, res, next) => {
  const { method, url, params, query, body, ip } = req;
  const logDetails = {
    method,
    url,
    ip,
    params,
    query,
    body,
  };

  logger.info(`Req: ${JSON.stringify(logDetails)}`);
  next();
};

module.exports = { logger, logRequest };
