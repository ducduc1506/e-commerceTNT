const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Middleware kiểm tra JWT (Xác thực người dùng)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("Decoded Token:", user); // 🔥 Xem thử user có dữ liệu id hay không
    req.user = user;
    next();
  });
};

// ✅ Middleware kiểm tra quyền Admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Middleware kiểm tra quyền User
const authorizeUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin, authorizeUser };
