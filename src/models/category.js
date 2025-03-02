"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Self-referencing relationship: danh mục cha - con
      Category.belongsTo(models.Category, {
        as: "parent",
        foreignKey: "parent_id",
      });
      Category.hasMany(models.Category, {
        as: "subcategories",
        foreignKey: "parent_id",
      });
      Category.hasMany(models.Product, {
        foreignKey: "category_id",
        as: "products",
      });
    }
  }

  Category.init(
    {
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      image: {
        type: DataTypes.STRING, // Lưu URL hoặc đường dẫn ảnh
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories",
    }
  );

  return Category;
};
