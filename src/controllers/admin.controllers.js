const config = require("../config");
const { adminServices, tokenServices } = require("../services");
const addCookie = require("../utils/addCokkie");
const catchAsync = require("../utils/catchAsync");
const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");
const { hashPassword, verifyPassword } = require("../utils/passwordEncoding");
const { sendSuccessResponse } = require("../utils/success");
const createAdmin = catchAsync(async (req, res) => {
  const { email, password, phone_number } = req.body;

  // Check if the admin email already exists
  const admin = await adminServices.emailExistsAll(email);
  if (admin) {
    const errorMessage = admin.deleted_at
      ? "Email already exists but has been deleted."
      : "Email already exists, please choose a different one.";
    return sendErrorResponse(statusCodes.CONFLICT, res, errorMessage);
  }

  // Create new admin
  const hashedPassword = await hashPassword(password);
  const adminData = { email, password: hashedPassword, phone_number };
  const adminExist = await adminServices.createUser(adminData);

  const response = {
    id: adminExist.id,
    name: adminExist.email,
  };

  sendSuccessResponse(
    statusCodes.OK,
    res,
    "User created successfully",
    response
  );
});

const loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // req.login;
  const adminExist = await adminServices.emailExistsAll(email);
  if (!adminExist) {
    return sendErrorResponse(statusCodes.NOT_FOUND, res, "Admin does't exist");
  }
  if (!(await verifyPassword(password, adminExist.password))) {
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      "Invalid email or password!"
    );
  }

  // Generate access token
  const payload = {
    id: adminExist.id,
    type: config.jwt.tokenTypes.ACCESS,
  };

  const accessToken = tokenServices.generateToken(
    payload,
    config.jwt.accessExpiration
  );

  // Generate refresh token
  const refreshPayload = {
    ...payload,
    type: config.jwt.tokenTypes.REFRESH,
  };

  const refreshToken = tokenServices.generateToken(
    refreshPayload,
    config.jwt.refreshExpiration,
    config.jwt.refreshSecret
  );

  // Set refresh token cookie
  addCookie(refreshToken, res);
  const response = {
    id: adminExist.id,
    name: `${adminExist.email}`,
    accessToken,
  };

  sendSuccessResponse(statusCodes.OK, res, "Logged in successfully!", response);
});

module.exports = {
  createAdmin,
  loginAdmin,
};
