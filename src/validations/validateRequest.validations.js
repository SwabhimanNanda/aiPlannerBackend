const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return sendErrorResponse(statusCodes.BAD_REQUEST, res, errorMessage);
    }
    next();
  };
};

module.exports = validate;
