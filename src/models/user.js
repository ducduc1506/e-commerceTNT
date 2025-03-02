const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Nếu có quan hệ với bảng khác, khai báo ở đây
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Email không được trùng
        validate: {
          isEmail: true, // Kiểm tra định dạng email
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Số điện thoại không được trùng
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user", // Mặc định là user
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );

  return User;
};
