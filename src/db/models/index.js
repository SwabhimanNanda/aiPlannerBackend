const logger = require("../../config/logger.config");
const { Sequelize, DataTypes } = require("sequelize");
const { dbConfig } = require("../../config/dbconfig");
const UserModel = require("./user.models");
console.log(dbConfig);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

const initDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(
      `Pinged your deployment. You successfully connected to ${sequelize.options.dialect} : ${sequelize.config.host}`
    );

    // Synchronizing models with database
    await sequelize.sync({ force: false });
    logger.info("Database synced successfully.");
  } catch (error) {
    console.log(error);

    logger.error(`Error connecting to the database: ${error.message}`);
  }
};

// // Call the function to initialize DB
// initDB();

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.init = initDB;

db.User = UserModel(sequelize, DataTypes); // 💥 IMPORTANT

module.exports = db;

// const connectDb = async () => {
//   try {
//     await mongoose.connect(MONGODB_URL);
//     logger.info("Connected to the database successfully");
//   } catch (err) {
//     logger.error("Database connection error:", err);
//     process.exit(1); // Exit the process with failure
//   }
//   mongoose.connection.on("error", (err) => {
//     logger.error("Database connection error:", err);
//   });
// };

// module.exports = connectDb;
