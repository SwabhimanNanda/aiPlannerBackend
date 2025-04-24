"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: DataTypes.INTEGER,
      gender: DataTypes.STRING,
    },
    {
      // hooks or other options can go here
    }
  );

  User.associate = function (models) {
    User.hasMany(models.HealthMetric, {
      foreignKey: "user_id",
      as: "HealthMetric",
    });
    // User.hasMany(models.PasswordReset, {
    //   foreignKey: "user_id",
    //   as: "token",
    // });
  };

  return User;
};
