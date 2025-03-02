// models/cartitem.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define("CartItem", {
    cart_id: {
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
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  CartItem.associate = function (models) {
    CartItem.belongsTo(models.Cart, {
      foreignKey: "cart_id",
      as: "cart",
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return CartItem;
};
