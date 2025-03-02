"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          category_name: "from seeder",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Lệnh để xóa dữ liệu đã tạo trong quá trình up
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
