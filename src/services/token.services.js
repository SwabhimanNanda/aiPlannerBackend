const jwt = require("jsonwebtoken");
const config = require("../config");
const { ApiError } = require("../utils/ApiError");
const statusCodes = require("../utils/httpStatus");

const generateTokens = (userId) => {
  const accessPayload = { id: userId, type: config.jwt.tokenTypes.ACCESS };
  const refreshPayload = { id: userId, type: config.jwt.tokenTypes.REFRESH };

  const accessToken = generateToken(accessPayload, config.jwt.accessExpiration);

  const refreshToken = generateToken(
    refreshPayload,
    config.jwt.refreshExpiration,
    config.jwt.refreshSecret
  );

  return { accessToken, refreshToken };
};
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
  generateTokens,
  generateToken,
  verifyToken,
};
