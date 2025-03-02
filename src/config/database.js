// config/database.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME, // Tên database
  username: process.env.DB_USER, // Tên user đăng nhập vào database
  password: process.env.DB_PASS, // Mật khẩu đăng nhập vào database
  host: process.env.DB_HOST, // Hoặc tên máy chủ cơ sở dữ liệu
  dialect: process.env.DB_TYPE, // Loại cơ sở dữ liệu
  logging: false, // Tắt logging nếu không muốn thấy SQL trong console
});

module.exports = sequelize;
