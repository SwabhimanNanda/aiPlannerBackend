const config = require("../config");
const { tokenServices, adminServices } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");
const checkAdminAuth = catchAsync(async (req, res, next) => {
  let token;
  const authorization = req.headers.authorization || req.cookies.accessToken;
  if (authorization?.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const decoded = tokenServices.verifyToken(token, config.jwt.jwtSecret);

      const user = await adminServices.getUserById(decoded.id);

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
      console.error(error);
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

module.exports = checkAdminAuth;
