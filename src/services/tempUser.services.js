const User = require("../db/models/tempUser.models");

const findUserByEmailOrUsername = async (email, username) => {
  return await User.findOne({ $or: [{ email }, { username }] });
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username }).select("+password");
};

const findUserById = async (id) => {
  return await User.findById({ _id: id });
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};
const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUserPassword = async (userId, newPassword) => {
  return await User.findByIdAndUpdate(
    userId,
    { password: newPassword },
    { new: true }
  );
};

const saveResetToken = async (userId, token) => {
  return await User.findByIdAndUpdate(userId, {
    resetToken: token,
    resetTokenExpiry: Date.now() + 15 * 60 * 1000,
  });
};

const findUserByResetToken = async (token) => {
  return await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
};

async function saveResetOTP(userId, otp, expiry) {
  await User.findByIdAndUpdate(userId, { resetOTP: otp, otpExpires: expiry });
}

const deleteTempUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};
const incrementFailedAttempts = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $inc: { failed_attempts: 1 } },
    { new: true }
  );
};

const resetFailedAttempts = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { failed_attempts: 0 },
    { new: true }
  );
};
const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};
module.exports = {
  findUserByEmailOrUsername,
  findUserByEmail,
  createUser,
  updateUserPassword,
  saveResetToken,
  saveResetOTP,
  findUserByResetToken,
  findUserByUsername,
  findUserById,
  deleteTempUser,
  incrementFailedAttempts,
  resetFailedAttempts,
  updateUser,
};
