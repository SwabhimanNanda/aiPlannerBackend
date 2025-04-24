const statusCodes = require("../utils/httpStatus");
const catchAsync = require("../utils/catchAsync");
const { sendSuccessResponse } = require("../utils/success");
const { sendErrorResponse } = require("../utils/failure");
const { healthServices } = require("../services");
const createHealth = catchAsync(async (req, res) => {
  const user_id = req.user.dataValues.id;
  const {
    date,
    bpm = 0,
    calories = null,
    steps = null,
    waterIntake = null,
    nutrition = { carbs: 0, protein: 0, fats: 0 },
    sleep = { duration: 0, bedTime: null, wakeupTime: null, quality: null },
    note = null,
  } = req.body;

  const metricData = {
    date,
    bpm,
    calories,
    steps,
    waterIntake,
    nutrition,
    sleep,
    note,
  };
  const newMetric = await healthServices.createOrUpdateMetric(
    user_id,
    metricData
  );
  return sendSuccessResponse(
    statusCodes.CREATED,
    res,
    "Health Data saved successfully",
    newMetric
  );
});

const getAllHealthData = catchAsync(async (req, res) => {
  const user = req.user;
  const metrics = await user.getHealthMetric({
    order: [["date", "DESC"]],
  });

  return sendSuccessResponse(
    statusCodes.OK,
    res,
    "Health metrics fetched successfully",
    metrics
  );
});

const getHealthDataByTimePeriodAndField = async (req, res) => {
  const { period, fields, from, to, limit = 10, offset = 0, sort } = req.query;
  const user = req.user;

  try {
    const attributes = fields
      ? fields.split(",").map((f) => f.trim())
      : undefined;

    const sortOrder = sort
      ? [sort.split(":")[0], (sort.split(":")[1] || "DESC").toUpperCase()]
      : ["date", "DESC"];

    const healthData = await healthServices.getHealthDataByPeriod(
      user.dataValues.id,
      period,
      attributes,
      { from, to, limit, offset, sortOrder }
    );

    if (!healthData || healthData.length === 0) {
      return sendErrorResponse(
        statusCodes.NOT_FOUND,
        res,
        "No data found for this period."
      );
    }

    return sendSuccessResponse(
      statusCodes.OK,
      res,
      "Health data fetched successfully",
      healthData
    );
  } catch (error) {
    return sendErrorResponse(
      statusCodes.INTERNAL_SERVER_ERROR,
      res,
      "Please Try Again Later",
      error
    );
  }
};

module.exports = {
  createHealth,
  getAllHealthData,
  getHealthDataByTimePeriodAndField,
};
