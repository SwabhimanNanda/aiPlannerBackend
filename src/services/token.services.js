const jwt = require("jsonwebtoken");
const config = require("../config");
const { ApiError } = require("../utils/ApiError");
const statusCodes = require("../utils/httpStatus");

const generateToken = (
  payloadData,
  expiresIn = config.jwt.defaultExpiration,
  secret = config.jwt.jwtSecret
) => {
  return jwt.sign(payloadData, secret, { expiresIn });
};

const verifyToken = (token, secret = config.jwt.jwtSecret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.log(error, "verifyToken - service");
    throw new ApiError(
      statusCodes.UNAUTHORIZED,
      "Not authorized, token verification failed!"
    );
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
