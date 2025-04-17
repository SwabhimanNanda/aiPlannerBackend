const statusCodes = require("./httpStatus");

class ApiError extends Error {
  constructor(
    statusCode,
    message,
    data = null,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, statusCodes.NOT_FOUND);
  }
}

class ValidationError extends ApiError {
  constructor(message = "Validation error") {
    super(message, statusCodes.BAD_REQUEST);
  }
}

// Add more custom errors as needed

module.exports = { ApiError, NotFoundError, ValidationError };
