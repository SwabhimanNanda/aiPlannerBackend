const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { combine, timestamp, printf, colorize, errors } = format;
const config = require("./index");

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ==> ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({
      format: () =>
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    }),
    errors({ stack: true }),
    logFormat
  ),

  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: config.logger.dailyLogPath,
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d", // keep logs for 14 days
      zippedArchive: true, // compress older files
    }),
    new DailyRotateFile({
      filename: config.logger.dailyErrorLogPath,
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d", // keep logs for 14 days
      zippedArchive: true, // compress older files
    }),
    // new transports.File({ filename: errorLogPath, level: "error" }),
    // new transports.File({ filename: combinedLogPath }),
  ],
});

module.exports = logger;
