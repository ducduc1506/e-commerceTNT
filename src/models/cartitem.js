const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: "cart_id", as: "cart" }); // ✅ Thêm alias
      CartItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      CartItem.belongsTo(models.ProductSize, {
        foreignKey: "size_id",
        as: "productSize",
      }); // ✅ Thêm alias
    }
  }

  CartItem.init(
    {
      cart_id: {
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
        defaultValue: 1,
      },
      selected: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "CartItems",
      timestamps: true,
    }
  );

  return CartItem;
};
