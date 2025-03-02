"use strict";

const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database"); // Import sequelize từ database.js
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

// Tự động quét và import tất cả các model
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Thiết lập associations (quan hệ giữa các model)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // Gắn instance sequelize vào db
db.Sequelize = Sequelize; // Gắn lớp Sequelize vào db

module.exports = db;
