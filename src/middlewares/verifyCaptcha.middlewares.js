const axios = require("axios");
const config = require("../config");
const { sendErrorResponse } = require("../utils/failure");
const statusCodes = require("../utils/httpStatus");
const verifyCaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: "CAPTCHA token is required" });
  }

  try {
    const secretKey = config.verifyCaptcha.capthaSecretKey;
    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

    const response = await axios.post(captchaVerifyUrl);

    if (!response.data.success) {
      return sendErrorResponse(
        statusCodes.BAD_REQUEST,
        res,
        "CAPTCHA verification failed"
      );
    }

    next();
  } catch (error) {
    return sendErrorResponse(statusCodes.INTERNAL_SERVER_ERROR, res, error);
  }
};

module.exports = verifyCaptcha;
