const config = require("../config");
const { tokenServices, userServices } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");
const checkUserAuth = catchAsync(async (req, res, next) => {
  let token;
  const authorization = req.headers.authorization || req.cookies.accessToken;
  if (authorization?.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const decoded = tokenServices.verifyToken(token, config.jwt.jwtSecret);

      const user = await userServices.findUserById(decoded.id);

      if (!user) {
        return res.status(statusCodes.UNAUTHORIZED).json({
          status: "error",
          code: statusCodes.UNAUTHORIZED,
          message: "User does not exists!",
          data: null,
          stack: null,
        });
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return sendErrorResponse(
          statusCodes.UNAUTHORIZED,
          res,
          "Token has expired. Please log in again!"
        );
      }

      return sendErrorResponse(
        statusCodes.UNAUTHORIZED,
        res,
        "Not authorized, token failed!"
      );
    }
  }

  if (!token) {
    sendErrorResponse(
      statusCodes.UNAUTHORIZED,
      res,
      "Please authenticate first!"
    );
  }
});

module.exports = checkUserAuth;
