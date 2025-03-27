const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "categoryData",
      }); //  Một sản phẩm thuộc về một danh mục
      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
      }); //  Một sản phẩm có nhiều ảnh phụ
      Product.hasMany(models.ProductSize, {
        foreignKey: "product_id",
        as: "sizes",
      }); //  Một sản phẩm có nhiều kích cỡ
      Product.hasMany(models.OrderItem, {
        foreignKey: "product_id",
        as: "order_items",
      }); //  Một sản phẩm có thể có trong nhiều đơn hàng
    }
  }

  Product.init(
    {
      sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      main_image: {
        type: DataTypes.STRING(255),
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      timestamps: false,
    }
  );

  return Product;
};
