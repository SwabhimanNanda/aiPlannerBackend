"use strict";

module.exports = (sequelize, DataTypes) => {
  const HealthMetric = sequelize.define(
    "HealthMetric",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      bpm: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
        },
      },
      calories: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
      steps: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
        },
      },
      waterIntake: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
      nutrition: {
        type: DataTypes.JSON,
        defaultValue: {
          carbs: 0,
          protein: 0,
          fats: 0,
        },
      },
      sleep: {
        type: DataTypes.JSON,
        defaultValue: {
          duration: 0,
          bedTime: null,
          wakeupTime: null,
          quality: null,
        },
      },
      note: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "healthMetrics",
      timestamps: true,
    }
  );

  HealthMetric.associate = function (models) {
    HealthMetric.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return HealthMetric;
};
