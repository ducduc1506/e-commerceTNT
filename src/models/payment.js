// models/payment.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Payment.associate = function (models) {
    Payment.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  };

  return Payment;
};
