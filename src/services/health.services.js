const { getDateRange } = require("../utils/dateUtils");
const { Op } = require("sequelize");
const { HealthMetric } = require("../db/models/");

const createOrUpdateMetric = async (userId, metricData) => {
  const { date } = metricData;
  const existingMetric = await findMetricByUserAndDate(userId, date);

  if (existingMetric) {
    return await updateMetric(existingMetric, metricData);
  } else {
    return await createMetric(userId, metricData);
  }
};
const findMetricByUserAndDate = async (userId, date) => {
  return await HealthMetric.findOne({
    where: {
      user_id: userId,
      date,
    },
  });
};

const updateMetric = async (existingMetric, newData) => {
  return await existingMetric.update(newData);
};

const createMetric = async (userId, metricData) => {
  return await HealthMetric.create({
    user_id: userId,
    ...metricData,
  });
};

// const getHealthDataByPeriod = async (
//   user_id,
//   period,
//   attributes,
//   options = {}
// ) => {
//   const { from, to, limit, offset, sortOrder } = options;

//   let startDate, endDate;
//   if (from && to) {
//     startDate = new Date(from);
//     endDate = new Date(to);
//   } else {
//     ({ startDate, endDate } = getDateRange(period));
//   }

//   try {
//     const healthData = await HealthMetric.findAll({
//       where: {
//         user_id,
//         date: {
//           [Op.gte]: startDate,
//           [Op.lte]: endDate,
//         },
//       },
//       attributes,
//       order: [sortOrder],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//     });

//     return healthData;
//   } catch (error) {
//     throw new Error("Error fetching health data: " + error.message);
//   }
// };

const getHealthDataByPeriod = async (userId, period, attributes) => {
  const { startDate, endDate } = getDateRange(period);

  return await HealthMetric.findAll({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    attributes,
    order: [["date", "DESC"]],
  });
};

const getDailyOverview = async (userId) => {
  try {
    const data = await HealthMetric.findOne({
      where: { user_id: userId },
      order: [["date", "DESC"]],
      attributes: ["date" , "steps", "calories", "sleep", "bpm", "waterIntake"],
    });
    if (data) {
      const overview = {
        date:data.date,
        steps: data.steps,
        calories: data.calories,
        bpm: data.bpm,
        waterIntake: data.waterIntake,
        sleep: data.sleep ? data.sleep.duration : null,
      };
      return overview;
    }

    return {};
  } catch (error) {
    console.error("Error in getDailyOverview:", error);
    throw error;
  }
};

const getWaterIntake = async (userId) => {
  try {
    const data = await HealthMetric.findOne({
      where: { user_id: userId },
      order: [["date", "DESC"]],
      attributes: ["waterIntake"],
    });

    return data || {};
  } catch (error) {
    console.error("Error in getWaterIntake:", error);
    throw error;
  }
};

const getNutrition = async (userId) => {
  try {
    const data = await HealthMetric.findOne({
      where: { user_id: userId },
      order: [["date", "DESC"]],
      attributes: ["nutrition"],
    });
    return data || {};
  } catch (error) {
    console.error("Error in getNutrition:", error);
    throw error;
  }
};



module.exports = {
  getHealthDataByPeriod,
  findMetricByUserAndDate,
  updateMetric,
  createMetric,
  createOrUpdateMetric,
  getDailyOverview,
  getWaterIntake,
  getNutrition
};
