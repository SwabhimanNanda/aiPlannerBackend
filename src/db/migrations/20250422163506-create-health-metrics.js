"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("healthMetrics", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      bpm: {
        type: Sequelize.INTEGER,
      },
      calories: {
        type: Sequelize.FLOAT,
      },
      steps: {
        type: Sequelize.INTEGER,
      },
      waterIntake: {
        type: Sequelize.FLOAT,
      },
      nutrition: {
        type: Sequelize.JSON,
        defaultValue: {
          carbs: 0,
          protein: 0,
          fats: 0,
        },
      },
      sleep: {
        type: Sequelize.JSON,
        defaultValue: {
          duration: 0,
          bedTime: null,
          wakeupTime: null,
          quality: null,
        },
      },
      note: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("healthMetrics");
  },
};
