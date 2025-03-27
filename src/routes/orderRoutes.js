const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.post("/order", authenticateToken, orderController.createOrder);

router.get(
  "/admin/order",
  authenticateToken,
  authorizeAdmin,
  orderController.getAllOrders
);

router.get("/order", authenticateToken, orderController.getUserOrders);

router.get("/order/:orderId", authenticateToken, orderController.getOrderById);

router.patch("/order/:orderId", authenticateToken, orderController.cancelOrder);

router.put(
  "/order/:orderId",
  authenticateToken,
  authorizeAdmin,
  orderController.updateOrderStatus
);

router.post("/create-order", async (req, res) => {
  try {
    const { address, totalPrice, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!address || !totalPrice || !paymentMethod) {
      return res.status(400).json({ error: "Thiếu thông tin đơn hàng" });
    }

    let status = "pending"; // Mặc định cho COD
    if (paymentMethod === "ZaloPay") {
      status = "waiting_payment";
    }

    // 🔹 Tạo đơn hàng trước
    const order = await OrderService.createOrder(
      userId,
      address,
      totalPrice,
      status
    );

    if (paymentMethod === "ZaloPay") {
      // Gửi request tạo URL thanh toán
      const paymentResponse = await axios.post(
        "http://localhost:8080/api/create-payment",
        {
          amount: totalPrice,
          orderId: order.id, // Gửi ID đơn hàng
        }
      );

      return res.json({
        orderId: order.id,
        paymentUrl: paymentResponse.data.orderurl,
      });
    }

    res.status(201).json({ message: "Đặt hàng thành công", order });
  } catch (error) {
    console.error("❌ Lỗi đặt hàng:", error);
    res.status(500).json({ error: "Lỗi server khi đặt hàng" });
  }
});

module.exports = router;
