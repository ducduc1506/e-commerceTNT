const AuthService = require("../services/authService");
const User = require("../models").User;

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, phone, password, role } = req.body;
      const result = await AuthService.register({
        name,
        email,
        phone,
        password,
        role,
      });
      if (result.success) {
        return res.status(201).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({
        message: "Server Error!",
      });
    }
  }

  static async login(req, res) {
    try {
      const { emailPhone, password } = req.body;
      const result = await AuthService.login(emailPhone, password);

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Set refreshToken với cấu hình đầy đủ
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Thay đổi 'strict' thành 'lax' hoặc 'none'
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/", // Đảm bảo cookie áp dụng cho toàn bộ trang
      });

      return res.status(200).json({
        success: true,
        message: "Login success",
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ message: "Server Error!" });
    }
  }

  static async changePassword(req, res) {
    try {
      const userId = req.user.id; // Lấy từ token
      const { oldPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Change Password Error:", error);
      return res.status(500).json({ message: "Server Error!" });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await User.findAll({
        order: [["id", "ASC"]],
        attributes: ["id", "name", "email", "phone", "role", "createdAt"],
      });

      return res.status(200).json({ success: true, users });
    } catch (error) {
      console.error("Fetch Users Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }

  // Xóa tài khoản (Admin)
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User không tồn tại" });
      }

      await user.destroy();

      return res
        .status(200)
        .json({ success: true, message: "Xóa tài khoản thành công" });
    } catch (error) {
      console.error("Delete User Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }

  // Cập nhật vai trò người dùng (Admin)
  static async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User không tồn tại" });
      }

      user.role = role;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Cập nhật vai trò thành công" });
    } catch (error) {
      console.error("Update User Role Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }

  static async logout(req, res) {
    // Xóa refreshToken khỏi cookie
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout success" });
  }

  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(403).json({ message: "No token provided" });
      }

      const result = await AuthService.refreshToken(refreshToken);
      if (!result.success) {
        return res.status(403).json(result);
      }

      // Set refreshToken mới vào cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Refresh token success",
        accessToken: result.accessToken,
      });
    } catch (error) {
      console.error("Refresh Token Error:", error);
      return res.status(500).json({ message: "Server Error!" });
    }
  }
}

module.exports = AuthController;
