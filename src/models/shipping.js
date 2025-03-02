// models/shipping.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define("Shipping", {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    tracking_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Shipping.associate = function (models) {
    Shipping.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  };

  return Shipping;
};
