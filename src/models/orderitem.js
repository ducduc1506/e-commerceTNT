"use strict";

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "order_items",
    }
  );

  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });

    OrderItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });

    OrderItem.belongsTo(models.ProductSize, {
      foreignKey: "size_id",
      as: "size",
    });
  };

  return OrderItem;
};
