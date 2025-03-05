const CartService = require("../services/cartService");

class CartController {
  static async addToCart(req, res) {
    try {
      const { product_id, size_id, quantity } = req.body;
      const userId = req.user.id; // Lấy ID user từ token

      const result = await CartService.addToCart(
        userId,
        product_id,
        size_id,
        quantity
      );
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async getCart(req, res) {
    try {
      console.log("Debug - req.body:", req.body);
      console.log("Debug - req.user.id:", req.user.id);
      const userId = req.user.id; // Lấy ID user từ token
      const cart = await CartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const { cartItemId, quantity } = req.body;

      if (!cartItemId || quantity == null) {
        return res
          .status(400)
          .json({ message: "Thiếu thông tin cartItemId hoặc quantity" });
      }

      if (quantity <= 0) {
        return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
      }

      const updatedItem = await CartService.updateQuantity(
        cartItemId,
        quantity
      );
      return res.json({
        message: "Cập nhật số lượng thành công",
        data: updatedItem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Lỗi server" });
    }
  }

  static async removeItem(req, res) {
    try {
      const { cartItemId } = req.params;

      await CartService.removeItem(cartItemId);
      return res.json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async toggleSelectItem(req, res) {
    try {
      const { cartItemId, selected } = req.body;
      const updatedItem = await CartService.toggleSelectItem(
        cartItemId,
        selected
      );

      return res.json({
        message: "Cập nhật trạng thái chọn thành công",
        data: updatedItem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async clearCart(req, res) {
    try {
      const userId = req.user.id;

      // Xóa tất cả sản phẩm trong giỏ hàng
      await CartService.clearCart(userId);

      return res.json({ message: "Đã xóa toàn bộ giỏ hàng" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }
}

module.exports = CartController;
