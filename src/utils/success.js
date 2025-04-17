const { responseStatuses } = require("../config/constants.config");

module.exports = {
  defaultSuccessMessage: "Successful",
  sendSuccessResponse: function (statusCode, res, message, data, meta) {
    res.status(statusCode).json({
      status: responseStatuses.SUCCESS,
      code: statusCode,
      message,
      data,
      meta,
    });
  },
  sendServiceSuccessObj: function (message, data = []) {
    return {
      status: responseStatuses.SUCCESS,
      message,
      data,
    };
  },
};
