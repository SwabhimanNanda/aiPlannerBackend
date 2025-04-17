const { ValidationError } = require("sequelize");
const { logger } = require("./logger.middlewares");
const { ApiError } = require("../utils/ApiError");
const config = require("../config");
const { responseStatuses } = require("../config/constants.config");
const statusCodes = require("../utils/httpStatus");

const notFound = (req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`);
  res.status(statusCodes.NOT_FOUND);
  next(err);
};

// eslint-disable-next-line no-unused-vars
const badJSONHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    const statusCode = statusCodes.BAD_REQUEST;
    console.log("Err => ", err, req.body);

    res.status(statusCode);
    throw new Error("Bad JSON format, please try again");
  } else {
    // Default to 500 if err.status is not a valid HTTP status code
    const statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
    console.log("Err => ", err, req.body);
    res.status(statusCode);
    throw new Error(
      "Could not perform the action, please check for valid payload if any, try again"
    );
  }
};

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || err instanceof ValidationError
        ? statusCodes.BAD_REQUEST
        : statusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || statusCodes[statusCode];
    error = new ApiError(statusCode, message, null, false, err.stack);
  }

  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { method, url, params, query, body, ip } = req;
  const errorDetails = {
    method,
    url,
    params,
    query,
    body,
    ip,
    errorMessage: err.message,
    // stack: err.stack,
  };
  if (!err.isOperational) logger.error(`${JSON.stringify(errorDetails)}`);
  console.error(err);

  let statusCode;
  if (err.isOperational) {
    statusCode = err.statusCode;
  } else if (res.statusCode === statusCodes.OK) {
    statusCode = statusCodes.INTERNAL_SERVER_ERROR;
  } else {
    statusCode = res.statusCode;
  }

  const response = {
    status: responseStatuses.ERROR,
    code: statusCode,
    message: err.message,
    data: err.data ? err.data : null,
    stack: config.env === "development" ? err.stack : null,
  };

  res.status(statusCode).json(response);
};

module.exports = { notFound, badJSONHandler, errorConverter, errorHandler };
