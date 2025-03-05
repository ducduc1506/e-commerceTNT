import axiosInstance from "../redux/axiosInstance";

const cartService = {
  addToCart: async (product_id, size_id, quantity = 1) => {
    try {
      // Kiểm tra token trước khi gửi request
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("❌ No token available when adding to cart");
        throw new Error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      }

      console.log("🛒 Adding to cart:", { product_id, size_id, quantity });

      const response = await axiosInstance.post("/cart/add", {
        product_id,
        size_id,
        quantity,
      });

      console.log("✅ Add to cart success:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding to cart:", error.response?.data || error);
      throw error;
    }
  },

  getCart: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("❌ No token available when fetching cart");
        throw new Error("Vui lòng đăng nhập để xem giỏ hàng");
      }

      const response = await axiosInstance.get("/cart");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching cart:", error.response?.data || error);
      throw error;
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Vui lòng đăng nhập để cập nhật giỏ hàng");

      const response = await axiosInstance.put(
        "/cart/update",
        { cartItemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật số lượng:",
        error.response?.data || error
      );
      throw error;
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token)
        throw new Error("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng");

      console.log("🗑 Xóa sản phẩm khỏi giỏ hàng:", cartItemId);

      const response = await axiosInstance.delete(
        `/cart/remove/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Xóa sản phẩm thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error.response?.data || error);
      throw error;
    }
  },
  toggleSelectItem: async (cartItemId, selected) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Vui lòng đăng nhập để chọn sản phẩm");

      const response = await axiosInstance.put(
        "/cart/select",
        { cartItemId, selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật selected:",
        error.response?.data || error
      );
      throw error;
    }
  },

  // API xóa toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Vui lòng đăng nhập để xóa giỏ hàng");

      const response = await axiosInstance.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi xóa giỏ hàng:", error.response?.data || error);
      throw error;
    }
  },
};

export default cartService;
