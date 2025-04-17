const User = require("../db/models/user.models");

const findUserByEmailOrUsername = async (email, username) => {
  return await User.findOne({ $or: [{ email }, { username }] });
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username }).select("+password");
};

const findUserById = async (id) => {
  return await User.findOne({ _id: id });
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

async function clearResetOTP(userId) {
  await User.findByIdAndUpdate(userId, {
    $unset: { resetOTP: 1, otpExpires: 1 },
  });
}
async function getResetOTP(userId) {
  try {
    const user = await User.findOne({ _id: userId }).select(
      "resetOTP otpExpires"
    );
    return user; // Returns the user document with resetOTP & otpExpires, or null if not found
  } catch (error) {
    console.error("Error fetching OTP:", error);
    return null;
  }
}

module.exports = {
  findUserByEmailOrUsername,
  findUserByEmail,
  createUser,
  clearResetOTP,
  updateUserPassword,
  saveResetToken,
  saveResetOTP,
  findUserByResetToken,
  findUserByUsername,
  findUserById,
  getResetOTP,
};
