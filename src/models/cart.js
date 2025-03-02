// models/cart.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Cart.associate = function (models) {
    Cart.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return Cart;
};
