"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("Users", "fullName", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "dob", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "gender", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("Users", "fullName"),
      queryInterface.removeColumn("Users", "dob"),
      queryInterface.removeColumn("Users", "gender"),
    ]);
  },
};
