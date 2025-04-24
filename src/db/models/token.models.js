"use strict";

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("password_reset", "email_verification"), // Add more if needed
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "tokens",
      hooks: {
        beforeCreate: (token) => {
          if (!token.expiresAt) {
            token.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
          }
        },
      },
    }
  );

  Token.associate = function (models) {
    Token.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Token;
};
