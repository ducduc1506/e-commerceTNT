// models/orderitem.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return OrderItem;
};
