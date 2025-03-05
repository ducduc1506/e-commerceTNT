// models/cart.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Cart.associate = (models) => {
    Cart.hasMany(models.CartItem, { foreignKey: "cart_id", as: "cartItems" });
  };

  return Cart;
};
