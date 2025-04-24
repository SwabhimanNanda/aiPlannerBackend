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

const getHealthDataByPeriod = async (
  user_id,
  period,
  attributes,
  options = {}
) => {
  const { from, to, limit, offset, sortOrder } = options;

  let startDate, endDate;
  if (from && to) {
    startDate = new Date(from);
    endDate = new Date(to);
  } else {
    ({ startDate, endDate } = getDateRange(period));
  }

  try {
    const healthData = await HealthMetric.findAll({
      where: {
        user_id,
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      attributes,
      order: [sortOrder],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return healthData;
  } catch (error) {
    throw new Error("Error fetching health data: " + error.message);
  }
};

module.exports = {
  getHealthDataByPeriod,
  findMetricByUserAndDate,
  updateMetric,
  createMetric,
  createOrUpdateMetric,
};
