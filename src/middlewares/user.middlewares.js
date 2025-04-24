const config = require("../config");
const { tokenServices, userServices } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");

const checkUserAuth = catchAsync(async (req, res, next) => {
  let token;
  const authorization = req.headers.authorization || req.cookies.accessToken;

  // Check if the authorization token exists and starts with "Bearer"
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return sendErrorResponse(
      statusCodes.UNAUTHORIZED,
      res,
      "Token not found or malformed!"
    );
  }

  try {
    // Extract token and verify it
    token = authorization.split(" ")[1];
    const decoded = tokenServices.verifyToken(token, config.jwt.jwtSecret);

    // Find the user associated with the token
    const user = await userServices.findUserById(decoded.id);
    if (!user) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: "error",
        code: statusCodes.UNAUTHORIZED,
        message: "User does not exist!",
        data: null,
        stack: null,
      });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return sendErrorResponse(
        statusCodes.UNAUTHORIZED,
        res,
        "Token has expired. Please log in again!"
      );
    }
    if (error.name === "JsonWebTokenError") {
      return sendErrorResponse(
        statusCodes.UNAUTHORIZED,
        res,
        "Invalid token! Please authenticate again."
      );
    }

    // Generic error response
    return sendErrorResponse(
      statusCodes.UNAUTHORIZED,
      res,
      "Not authorized, token failed!"
    );
  }
});

module.exports = checkUserAuth;
