require("dotenv").config(); // Nạp biến môi trường từ .env

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  // Bạn có thể thêm các cấu hình cho 'production' và 'test' nếu cần
};
