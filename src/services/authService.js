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
        return { success: false, message: "Email or Phone already exists" };
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
        return { success: false, message: "User not found" };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Password is incorrect" };
      }

      if (user && isMatch) {
        const accessToken = AuthService.generateAccessToken(user);
        const refreshToken = AuthService.generateRefreshToken(user);
        return {
          success: true,
          message: "Login success",
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

  // Refresh Token
  static async refreshToken(refreshToken) {
    try {
      const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const accessToken = AuthService.generateAccessToken(user);
      return { success: true, accessToken };
    } catch (error) {
      console.error("Refresh Token Error:", error);
      return { success: false, message: "Invalid token" };
    }
  }
}

module.exports = AuthService;
