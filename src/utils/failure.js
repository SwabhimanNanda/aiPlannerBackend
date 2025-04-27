const { ApiError } = require("./ApiError");
const { responseStatuses } = require("../config/constants.config");

module.exports = {
  defaultErrorMessage: "Failed! Something went wrong",
  sendErrorResponse: function (statusCode, res, message, data = null) {
    res.status(statusCode);
    throw new ApiError(statusCode, message, data);
    
    /* res.status(statusCode).json({
      status: responseStatuses.ERROR,
      code: statusCode,
      message,
      data,
    }); */
  },
  sendServiceErrorObj: function (message, data = []) {
    return {
      status: responseStatuses.ERROR,
      message: message || "Something went wrong!",
      data,
    };
  },
};
