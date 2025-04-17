const bcrypt = require("bcrypt");
const logger = require("../config/logger.config");
const hashPassword = async (plainPassword) => {
  try {
    // Generate a salt (default 10 rounds)
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password along with the salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    logger.error("Error hashing password:", error);
    throw error;
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    logger.error("Error verifying password:", error);
    throw error;
  }
};

module.exports = { hashPassword, verifyPassword };
