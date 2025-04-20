// src/config/db.config.js
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  test: {
    username: process.env.CI_DB_USERNAME || "root",
    password: process.env.CI_DB_PASSWORD || "",
    database: process.env.CI_DB_NAME || "test_db",
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};

const env = process.env.NODE_ENV || "development";
const dbConfig = module.exports[env];

module.exports.dbConfig = dbConfig;
