"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Lệnh để tạo dữ liệu mới vào database
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "minhduc",
          email: "minhduc@example.com",
          password: "hashedPassword",
          phone: "0987654321",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Lệnh để xóa dữ liệu đã tạo trong quá trình up
    await queryInterface.bulkDelete("Users", null, {});
  },
};
