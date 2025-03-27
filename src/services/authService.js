const { Op } = require("sequelize");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  // Tạo Access Token
  static generateAccessToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  }

  //Tạo Refresh Token
  static generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });
  }

  // Đăng ký
  static async register({ name, email, phone, password, role }) {
    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { phone: phone }],
        },
      });
      if (user) {
        return {
          success: false,
          message: "Email hoặc số điện thoại đã tồn tại",
        };
      }
      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        name,
        email,
        phone,
        password: hashPassword,
        role,
      });
      const accessToken = AuthService.generateAccessToken(newUser);
      const refreshToken = AuthService.generateRefreshToken(newUser, "refresh");
      return {
        success: true,
        message: "Register success",
        user: { name, email, phone, role },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Register Error:", error);
      return { success: false, message: "Server Error!" };
    }
  }

  // Đăng nhập
  static async login(emailPhone, password) {
    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: emailPhone }, { phone: emailPhone }],
        },
      });
      if (!user) {
        return {
          success: false,
          message: "Tài khoản hoặc mật khẩu không chính xác",
        };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: "Tài khoản hoặc mật khẩu không chính xác",
        };
      }

      if (user && isMatch) {
        const accessToken = AuthService.generateAccessToken(user);
        const refreshToken = AuthService.generateRefreshToken(user);
        return {
          success: true,
          message: "Đăng nhập thành công",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
          refreshToken,
        };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Server Error!" };
    }
  }

  // Đổi mật khẩu
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return { success: false, message: "Mật khẩu cũ không đúng" };
      }

      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(newPassword, salt);

      user.password = hashPassword;
      await user.save();

      return { success: true, message: "Thay đổi mật khẩu thành công" };
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      return { success: false, message: "Server Error!" };
    }
  }

  // static async getAllUsers() {
  //   try {
  //     const users = await User.findAll({
  //       attributes: ["id", "name", "email", "phone", "role", "createdAt"], // Chỉ lấy các thông tin cần thiết
  //     });
  //     return { success: true, users };
  //   } catch (error) {
  //     console.error("Lỗi khi lấy danh sách người dùng:", error);
  //     return { success: false, message: "Server Error!" };
  //   }
  // }

  // // Xóa tài khoản (chỉ admin được phép)
  // static async deleteUser(userId) {
  //   try {
  //     const user = await User.findByPk(userId);
  //     if (!user) {
  //       return { success: false, message: "Không tìm thấy người dùng" };
  //     }

  //     await user.destroy();
  //     return { success: true, message: "Xóa tài khoản thành công" };
  //   } catch (error) {
  //     console.error("Lỗi khi xóa tài khoản:", error);
  //     return { success: false, message: "Server Error!" };
  //   }
  // }

  // // Cập nhật quyền (chỉ admin có quyền thay đổi)
  // static async updateRole(userId, newRole) {
  //   try {
  //     const user = await User.findByPk(userId);
  //     if (!user) {
  //       return { success: false, message: "Không tìm thấy người dùng" };
  //     }

  //     user.role = newRole;
  //     await user.save();

  //     return { success: true, message: "Cập nhật quyền thành công", user };
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật quyền:", error);
  //     return { success: false, message: "Server Error!" };
  //   }
  // }

  // Refresh Token
  static async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Tìm user để lấy thông tin đầy đủ
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Tạo cả access token và refresh token mới
      const accessToken = AuthService.generateAccessToken(user);
      const newRefreshToken = AuthService.generateRefreshToken(user);

      return {
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Refresh Token Error:", error);
      return { success: false, message: "Invalid token" };
    }
  }
}

module.exports = AuthService;
