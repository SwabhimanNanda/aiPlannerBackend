const statusCodes = require("../utils/httpStatus");
const catchAsync = require("../utils/catchAsync");
const { sendErrorResponse } = require("../utils/failure");
const { sendSuccessResponse } = require("../utils/success");
const healthData = require("../../uploads/demoData/healthData");

const getHealthBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const slugNumber = Number(slug);
  try {
    const result = healthData.find((entry) => entry.slug == slugNumber);

    if (!result) {
      return sendErrorResponse(
        statusCodes.CONFLICT,
        res,
        "Health Data Not Found"
      );
    }

    sendSuccessResponse(
      statusCodes.OK,
      res,
      "User created successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      statusCodes.NOT_FOUND,
      res,
      "Error reading health data",
      error
    );
  }
});

module.exports = {
  getHealthBySlug,
};
