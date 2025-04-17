const crypto = require("crypto");
const config = require("../config");

const generateOtp = (length = config.otp.otpLength) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp_code = crypto.randomInt(min, max);
  const expires_at = new Date(
    Date.now() + config.otp.expiryMinutes * 60 * 1000
  ); // Using config for expiry time

  return {
    otp_code,
    expires_at,
  };
};

module.exports = {
  generateOtp,
};
