// models/order.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Order.associate = function (models) {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return Order;
};
