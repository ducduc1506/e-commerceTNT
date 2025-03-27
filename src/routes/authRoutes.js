const router = require("express").Router();
const AuthController = require("../controllers/authController");
const {
  authenticateToken,
  authorizeAdmin,
  authorizeUser,
} = require("../middleware/authMiddleware");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.post(
  "/change-password",
  authenticateToken,
  AuthController.changePassword
);

router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  AuthController.getUsers
);
router.delete(
  "/users/:userId",
  authenticateToken,
  authorizeAdmin,
  AuthController.deleteUser
);
router.put(
  "/users/:userId/role",
  authenticateToken,
  authorizeAdmin,
  AuthController.updateUserRole
);

router.post("/logout", authenticateToken, AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);

// Ví dụ route chỉ admin mới có quyền truy cập
router.get("/admin-data", authenticateToken, authorizeAdmin, (req, res) => {
  res.json({ message: "Admin Data Access Granted" });
});

// Ví dụ route user hoặc admin có thể truy cập
router.get("/user-data", authenticateToken, (req, res) => {
  res.json({ message: "User Data Access Granted" });
});

module.exports = router;
