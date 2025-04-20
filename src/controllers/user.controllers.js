const bcrypt = require("bcrypt");
const config = require("../config");
const {
  tokenServices,
  userServices,
  otpServices,
  emailService,
} = require("../services");
const addCookie = require("../utils/addCokkie");
const catchAsync = require("../utils/catchAsync");
const { emailTemplates } = require("../utils/emailTemplates");
const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");
const { hashPassword, verifyPassword } = require("../utils/passwordEncoding");
const { sendSuccessResponse } = require("../utils/success");

const registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userServices.findUserByEmail(email);
  if (existingUser) {
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      "Email already exists"
    );
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await userServices.createUser({
    email,
    password: hashedPassword,
  });
  const { accessToken, refreshToken } = tokenServices.generateTokens(
    newUser.id
  );

  addCookie(refreshToken, res);

  const response = {
    id: newUser.id,
    email: newUser.email,
    accessToken,
  };

  return sendSuccessResponse(
    statusCodes.OK,
    res,
    "User registered successfully",
    response
  );
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return sendErrorResponse(statusCodes.BAD_REQUEST, res, "Email is required");
  }

  const user = await userServices.findUserByEmail(email);

  if (!user) {
    return sendErrorResponse(statusCodes.NOT_FOUND, res, "Email not found");
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      "Invalid credentials"
    );
  }

  const { accessToken, refreshToken } = tokenServices.generateTokens(user.id);

  addCookie(refreshToken, res);

  const response = {
    id: user.id,
    email: user.email,
    accessToken,
  };

  // await emailService.sendEmail(
  //   user.email,
  //   "Login Successful",
  //   emailTemplates.loginSuccess(user)
  // );

  return sendSuccessResponse(statusCodes.OK, res, "Login successful", response);
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await userServices.findUserByEmail(email);
  if (!user) {
    return sendErrorResponse(statusCodes.NOT_FOUND, res, "Email not found");
  }

  const otp = otpServices.generateOtp(config.otp.otpLength);

  const hashedOtp = await bcrypt.hash(otp.otp_code.toString(), 10);

  await userServices.saveResetOTP(user.id, hashedOtp, otp.expires_at);

  await emailService.sendEmail(
    user.email,
    "Here’s Your Password Reset Code",
    emailTemplates.passwordResetOTP(user.name, otp.otp_code)
  );

  return sendSuccessResponse(statusCodes.OK, res, "OTP sent to your email.");
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await userServices.findUserByEmail(email);
  if (!user) {
    return sendErrorResponse(statusCodes.NOT_FOUND, res, "User not found");
  }

  if (!user.resetOTP) {
    return sendErrorResponse(
      statusCodes.NOT_FOUND,
      res,
      "No OTP request found."
    );
  }

  if (user.otpExpires < new Date()) {
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      "OTP has expired. Please request a new one."
    );
  }

  const isOtpValid = await bcrypt.compare(String(otp), user.resetOTP);
  if (!isOtpValid) {
    return sendErrorResponse(
      statusCodes.UNAUTHORIZED,
      res,
      "Invalid OTP. Please try again."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userServices.updateUserPassword(user.id, hashedPassword);

  await userServices.clearResetOTP(user.id);
  await emailService.sendEmail(
    user.email,
    "Here’s Your Password Reset Code",
    emailTemplates.passwordResetSuccess(user.name)
  );
  return sendSuccessResponse(
    statusCodes.OK,
    res,
    "Password reset successfully."
  );
});

const usernameExist = catchAsync(async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      "Username Not Provided"
    );
  }
  const usernameAvailable = await userServices.findUserByUsername(username);
  if (usernameAvailable) {
    return sendErrorResponse(
      statusCodes.CONFLICT,
      res,
      "Username Not Available"
    );
  } else {
    sendSuccessResponse(statusCodes.OK, res, "Username Available", username);
  }
});

const emailVerified = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user.isEmailVerified) {
    const otp = otpServices.generateOtp(config.otp.otpLength);
    const hashedOtp = await bcrypt.hash(otp.otp_code.toString(), 10);
    await userServices.saveResetOTP(user.id, hashedOtp, otp.expires_at);
    await emailService.sendEmail(
      user.email,
      "Here’s Your Email Verification Code",
      emailTemplates.passwordResetOTP(user.name, otp.otp_code)
    );
    return sendSuccessResponse(statusCodes.OK, res, "OTP sent to your email.");
  } else {
    return sendErrorResponse(
      statusCodes.CONFLICT,
      res,
      "Email Already Verified"
    );
  }
});

const emailOtpVerified = catchAsync(async (req, res) => {
  const { otp } = req.body;
  const user = req.user;

  if (!user.isEmailVerified) {
    if (!user.resetOTP) {
      return sendErrorResponse(
        statusCodes.NOT_FOUND,
        res,
        "No OTP request found."
      );
    }

    if (user.otpExpires < new Date()) {
      return sendErrorResponse(
        statusCodes.BAD_REQUEST,
        res,
        "OTP has expired. Please request a new one."
      );
    }

    const isOtpValid = await bcrypt.compare(String(otp), user.resetOTP);
    if (!isOtpValid) {
      return sendErrorResponse(
        statusCodes.UNAUTHORIZED,
        res,
        "Invalid OTP. Please try again."
      );
    }

    // Clear OTP after successful verification
    await userServices.clearResetOTP(user._id);

    // Update email verification status and save user
    user.isEmailVerified = true;
    await user.save();

    return sendSuccessResponse(statusCodes.OK, res, "Email has been verified.");
  } else {
    return sendErrorResponse(
      statusCodes.CONFLICT,
      res,
      "Email Already Verified"
    );
  }
});

const getAllInfoUser = catchAsync(async (req, res) => {
  const user = req.user;
  return sendSuccessResponse(statusCodes.OK, res, "User Data", user);
});

const getNewAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return sendErrorResponse(
      statusCodes.UNAUTHORIZED,
      res,
      "No refresh token, please log in again!"
    );
  }

  try {
    const decoded = tokenServices.verifyToken(
      refreshToken,
      config.jwt.refreshSecret
    );
    const user = await userServices.findUserById(decoded.id);

    if (!user) {
      return sendErrorResponse(
        statusCodes.UNAUTHORIZED,
        res,
        "User not found!"
      );
    }

    // Generate new access token
    const newAccessToken = tokenServices.generateToken(
      user.id,
      config.jwt.jwtSecret,
      "15m"
    );

    res.json({
      status: "success",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return sendErrorResponse(
      statusCodes.UNAUTHORIZED,
      res,
      "Invalid or expired refresh token!",
      error
    );
  }
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  usernameExist,
  emailVerified,
  emailOtpVerified,
  getAllInfoUser,
  getNewAccessToken,
};
