const OrderService = require("../services/orderService");

class OrderController {
  static async createOrder(req, res) {
    try {
      console.log("📩 Dữ liệu nhận được:", req.body);
      console.log(
        "🔍 Kiểm tra items:",
        req.body.items,
        "Loại:",
        typeof req.body.items
      );
      console.log("🔍 Kiểm tra items.length:", req.body.items.length);

      const userId = req.user.id;
      const { address, totalPrice } = req.body; // 🔹 Nhận `totalPrice` từ request

      if (!address || !totalPrice) {
        return res
          .status(400)
          .json({ error: "Vui lòng cung cấp địa chỉ và tổng tiền" });
      }

      const order = await OrderService.createOrder(userId, address, totalPrice);

      return res.status(201).json({ message: "Đặt hàng thành công", order });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAllOrders(req, res) {
    try {
      console.log("✅ [ADMIN] Fetching all orders...");

      const orders = await OrderService.getAllOrders(); // Gọi service lấy đơn hàng
      console.log("✅ [ADMIN] Orders fetched:", orders);

      return res.json(orders);
    } catch (error) {
      console.error("❌ [ADMIN] Lỗi khi lấy danh sách đơn hàng:", error);
      return res
        .status(500)
        .json({ error: error.message || "Lỗi khi lấy danh sách đơn hàng" });
    }
  }

  static async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      console.log("Debug - userId:", userId); // Log user ID

      const orders = await OrderService.getUserOrders(userId);
      console.log("Debug - orders:", orders); // Log danh sách đơn hàng

      return res.json(orders);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      return res
        .status(500)
        .json({ error: error.message || "Lỗi khi lấy danh sách đơn hàng" });
    }
  }

  static async getOrderById(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.id; // Lấy từ token

      const order = await OrderService.getOrderById(orderId, userId);
      return res.json({ message: "Lấy chi tiết đơn hàng thành công", order });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.id; // Lấy từ token

      const result = await OrderService.cancelOrder(orderId, userId);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body; // Nhận trạng thái mới từ request

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        status
      );

      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
