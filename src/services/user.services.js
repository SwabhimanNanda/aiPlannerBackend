const { User } = require("../db/models/"); // Assuming User model is defined and exported from models/index.js

const findUserByEmailOrUsername = async (email, username) => {
  return await User.findOne({
    where: {
      [User.sequelize.Op.or]: [{ email }, { username }],
    },
  });
};

const findUserByUsername = async (username) => {
  return await User.findOne({
    where: { username },
    attributes: { include: ["password"] }, // Assuming password is excluded by default
  });
};

const findUserById = async (id) => {
  return await User.findByPk(id);
};

const findUserByEmail = async (email) => {
  return await User.findOne({
    where: { email },
    // attributes: { include: ['password'] } // Assuming password is excluded by default
  });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUserPassword = async (userId, newPassword) => {
  const user = await User.findByPk(userId);
  if (user) {
    user.password = newPassword;
    await user.save();
    return user;
  }
  return null;
};

const saveResetToken = async (userId, token) => {
  return await User.update(
    {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
    },
    {
      where: { id: userId },
    }
  );
};

const findUserByResetToken = async (token) => {
  return await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        [User.sequelize.Op.gt]: new Date(),
      },
    },
  });
};

async function saveResetOTP(userId, otp, expiry) {
  await User.update(
    { resetOTP: otp, otpExpires: expiry },
    { where: { id: userId } }
  );
}

async function clearResetOTP(userId) {
  await User.update(
    {
      resetOTP: null,
      otpExpires: null,
    },
    { where: { id: userId } }
  );
}

async function getResetOTP(userId) {
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["resetOTP", "otpExpires"],
    });
    return user; // Returns the user with only resetOTP & otpExpires, or null if not found
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
