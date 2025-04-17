const bcrypt = require("bcrypt");
const config = require("../config");
const {
  userServices,
  otpServices,
  emailService,
  tempService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const { emailTemplates } = require("../utils/emailTemplates");
const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");
const { hashPassword } = require("../utils/passwordEncoding");
const { sendSuccessResponse } = require("../utils/success");

const registerUser = catchAsync(async (req, res) => {
  const { name, username, email, password, phone_number, age } = req.body;

  const existingUser = await userServices.findUserByEmailOrUsername(
    email,
    username
  );
  if (existingUser) {
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      existingUser.email === email
        ? "Email already registered."
        : "Username already taken."
    );
  }

  // ✅ Check if email exists in the temp_users collection
  const existingUserInTempUserDb = await tempService.findUserByEmail(email);
  if (existingUserInTempUserDb) {
    // ✅ Check if the new username is already taken (excluding the current temp user)
    const usernameExists = await tempService.findUserByUsername(username);
    if (
      usernameExists &&
      usernameExists._id.toString() !== existingUserInTempUserDb._id.toString()
    ) {
      return sendErrorResponse(
        statusCodes.BAD_REQUEST,
        res,
        "Username already taken."
      );
    }

    // ✅ Update existing user in temp_users (allowing username change)
    const updatedUser = await tempService.updateUser(
      existingUserInTempUserDb._id,
      {
        name,
        username, // Updated username
        password: await hashPassword(password),
        phone_number,
        age,
      }
    );

    // ✅ Generate & resend OTP
    const otp = otpServices.generateOtp(config.otp.otpLength);
    const hashedOtp = await bcrypt.hash(otp.otp_code.toString(), 10);
    await tempService.saveResetOTP(updatedUser._id, hashedOtp, otp.expires_at);

    await emailService.sendEmail(
      updatedUser.email,
      "Here’s Your Email Verification Code",
      emailTemplates.passwordResetOTP(
        updatedUser.name.toUpperCase(),
        otp.otp_code
      )
    );

    return sendSuccessResponse(
      statusCodes.OK,
      res,
      "User details updated. A new OTP has been sent to your email.",
      updatedUser
    );
  }

  // now check username is present or not in temp_db
  const existingUserInTempDb = await tempService.findUserByUsername(username);
  if (existingUserInTempDb) {
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      "Username already Taken."
    );
  }
  // ✅ If user is completely new, register them
  const hashedPassword = await hashPassword(password);
  const newUser = await tempService.createUser({
    name,
    username,
    email,
    password: hashedPassword,
    phone_number,
    age,
  });

  // ✅ Generate & send OTP
  const otp = otpServices.generateOtp(config.otp.otpLength);
  const hashedOtp = await bcrypt.hash(otp.otp_code.toString(), 10);
  await tempService.saveResetOTP(newUser._id, hashedOtp, otp.expires_at);

  await emailService.sendEmail(
    newUser.email,
    "Here’s Your Email Verification Code",
    emailTemplates.passwordResetOTP(newUser.name.toUpperCase(), otp.otp_code)
  );

  return sendSuccessResponse(
    statusCodes.OK,
    res,
    "User registered successfully. Please verify your email.",
    newUser
  );
});

const verifyOtp = catchAsync(async (req, res) => {
  const { userId, otp } = req.body;
  // Find the temporary user by ID
  const tempUser = await tempService.findUserById(userId);
  if (!tempUser) {
    return sendErrorResponse(
      statusCodes.NOT_FOUND,
      res,
      "User not found or OTP expired"
    );
  }

  // Check if OTP has expired
  if (tempUser.otpExpires < new Date()) {
    return sendErrorResponse(statusCodes.BAD_REQUEST, res, "OTP has expired.");
  }

  // Check the number of failed attempts
  if (tempUser.failed_attempts >= 3) {
    // Delete the user if they've failed 3 times
    await tempService.deleteTempUser(tempUser.id);
    return sendErrorResponse(
      statusCodes.BAD_REQUEST,
      res,
      "Too many failed attempts. Your data has been deleted."
    );
  }

  // Verify the OTP entered by the user
  const isOtpValid = await bcrypt.compare(String(otp), tempUser.resetOTP);
  if (!isOtpValid) {
    // Increment failed attempts
    await tempService.incrementFailedAttempts(tempUser.id);
    return sendErrorResponse(statusCodes.BAD_REQUEST, res, "Invalid OTP.");
  }

  // ✅ Check if the email already exists in the main `User` model
  const existingUser = await userServices.findUserByEmail(tempUser.email);
  if (existingUser) {
    // If the user exists, delete the temporary user and return success (OTP verification is still valid)
    await tempService.deleteTempUser(tempUser.id);
    return sendErrorResponse(
      statusCodes.CONFLICT,
      res,
      "Email Already exists."
    );
  }

  // ✅ OTP is valid, email is not registered yet → Proceed with user creation

  const newUser = await userServices.createUser({
    name: tempUser.name,
    username: tempUser.username,
    email: tempUser.email,
    password: tempUser.password, // Already hashed
    phone_number: tempUser.phone_number,
    age: tempUser.age,
  });

  // Delete temp user after successful registration
  await tempService.deleteTempUser(tempUser.id);

  return sendSuccessResponse(
    statusCodes.OK,
    res,
    "OTP verified successfully, and account has been created.",
    newUser
  );
});

const resendOtp = catchAsync(async (req, res) => {
  const { userId } = req.body;

  // Find user in temp database by userId
  const tempUser = await tempService.findUserById(userId);
  if (!tempUser) {
    return sendErrorResponse(
      statusCodes.NOT_FOUND,
      res,
      "User not found or OTP already verified."
    );
  }

  // Generate a new OTP
  const otp = otpServices.generateOtp(config.otp.otpLength);
  const hashedOtp = await bcrypt.hash(otp.otp_code.toString(), 10);

  // Update OTP in database
  await tempService.saveResetOTP(tempUser._id, hashedOtp, otp.expires_at);

  // Send the new OTP via email
  await emailService.sendEmail(
    tempUser.email,
    "Your New Verification Code",
    emailTemplates.passwordResetOTP(tempUser.name.toUpperCase(), otp.otp_code)
  );

  return sendSuccessResponse(
    statusCodes.OK,
    res,
    "A new OTP has been sent to your email."
  );
});

module.exports = { registerUser, verifyOtp, resendOtp };
