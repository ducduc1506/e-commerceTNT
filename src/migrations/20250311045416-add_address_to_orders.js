"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("orders", "address", {
      type: Sequelize.STRING,
      allowNull: false, // Bắt buộc nhập địa chỉ
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("orders", "address");
  },
};
