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
  const { period, fields } = req.query;
  const user = req.user;

  let healthData;
  const attributes = fields
    ? Array.from(new Set(["date", ...fields.split(",").map((f) => f.trim())]))
    : undefined;

  if (!period) {
    healthData = await user.getHealthMetric({
      attributes,
      order: [["date", "DESC"]],
    });
  } else {
    healthData = await healthServices.getHealthDataByPeriod(
      user.dataValues.id,
      period,
      attributes
    );
  }
  if (healthData.length == 0) {
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
};

const getHomeData = async (req, res) => {
  const user = req.user;
  const result = []; // ✅ Array

  try {
    const [dailyOverviewResult, waterIntakeResult, nutritionResult] = await Promise.allSettled([
      healthServices.getDailyOverview(user.dataValues.id),
      healthServices.getWaterIntake(user.dataValues.id),
      healthServices.getNutrition(user.dataValues.id)
    ]);
    
    if (dailyOverviewResult.status === "fulfilled") {
      result.push({ key: "dailyOverview", data: dailyOverviewResult.value });
    } else {
      console.log("Error fetching daily overview:", dailyOverviewResult.reason);
    }

    if (waterIntakeResult.status === "fulfilled") {
      result.push({ key: "waterIntake", data: waterIntakeResult.value });
    } else {
      console.log("Error fetching water intake:", waterIntakeResult.reason);
    }

    if (nutritionResult.status === "fulfilled") {
      result.push({ key: "nutrition", data: nutritionResult.value });
    } else {
      console.log("Error fetching nutrition:", nutritionResult.reason);
    }

    return sendSuccessResponse(
      statusCodes.OK,
      res,
      "Health data fetched successfully",
      result
    );
  } catch (error) {
    console.log("Unexpected error fetching home data:", error);
    return sendErrorResponse(
      res,
      statusCodes.INTERNAL_SERVER_ERROR,
      "Failed to fetch home data"
    );
  }
};



module.exports = {
  createHealth,
  getAllHealthData,
  getHealthDataByTimePeriodAndField,
  getHomeData
};
