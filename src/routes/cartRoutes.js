const express = require("express");
const CartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Áp dụng middleware authenticateToken để bảo vệ các route giỏ hàng
router.get("/cart", authenticateToken, CartController.getCart);
router.post("/cart/add", authenticateToken, CartController.addToCart);
router.put("/cart/update", authenticateToken, CartController.updateQuantity);
router.delete(
  "/cart/remove/:cartItemId",
  authenticateToken,
  CartController.removeItem
);
router.put("/cart/select", authenticateToken, CartController.toggleSelectItem);
router.delete("/cart/clear", authenticateToken, CartController.clearCart);

module.exports = router;
