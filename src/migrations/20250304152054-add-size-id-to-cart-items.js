"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("CartItems", "size_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ProductSizes", // Tên bảng chứa size sản phẩm
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("CartItems", "size_id");
  },
};
