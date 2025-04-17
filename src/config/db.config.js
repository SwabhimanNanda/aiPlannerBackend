// //like, dialect options
const dotenv = require("dotenv");
dotenv.config();

// module.exports = {
//   development: {
//     username: process.env.DEV_DB_USERNAME,
//     password: process.env.DEV_DB_PASSWORD,
//     database: process.env.DEV_DB_NAME,
//     host: process.env.DEV_DB_HOST,
//     port: process.env.DEV_DB_PORT,
//     dialect: process.env.DEV_DB_DIALECT,
//     dialectOptions: {
//       bigNumberStrings: true,
//     },
//   },
//   test: {
//     username: process.env.CI_DB_USERNAME,
//     password: process.env.CI_DB_PASSWORD,
//     database: process.env.CI_DB_NAME,
//     host: "127.0.0.1",
//     port: 3306,
//     dialect: process.env.CI_DB_DIALECT,
//     dialectOptions: {
//       bigNumberStrings: true,
//     },
//   },
//   production: {
//     username: process.env.PROD_DB_USERNAME,
//     password: process.env.PROD_DB_PASSWORD,
//     database: process.env.PROD_DB_NAME,
//     host: process.env.PROD_DB_HOSTNAME,
//     port: process.env.PROD_DB_PORT,
//     dialect: process.env.PROD_DB_DIALECT,
//     dialectOptions: {
//       bigNumberStrings: true,
//       // ssl: {
//       //   ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt'),
//       // },
//     },
//   },
// };

// config.js
const MONGODB_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_MONGODB_URL
    : process.env.HOSTED_MONGODB_URL;
module.exports = {
  MONGODB_URL,
};
