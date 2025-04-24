const logger = require("../../config/logger.config");
const { Sequelize, DataTypes } = require("sequelize");
const { dbConfig } = require("../../config/dbconfig");

// Initialize sequelize instance first
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

// Import models after sequelize instance initialization
const User = require("./user.models")(sequelize, DataTypes);
const HealthMetric = require("./healthMetric.models")(sequelize, DataTypes);
const TokenModel = require("./token.models")(sequelize, DataTypes);

// Initialize DB
const initDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(
      `Pinged your deployment. You successfully connected to ${sequelize.options.dialect} : ${sequelize.config.host}`
    );
    await sequelize.sync({ force: false });
    logger.info("Database synced successfully.");
  } catch (error) {
    logger.error(`Error connecting to the database: ${error.message}`);
  }
};

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.init = initDB;

// Add models to db object
db.User = User;
db.Token = TokenModel;
db.HealthMetric = HealthMetric;

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
