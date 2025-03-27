import axiosInstance from "../redux/axiosInstance";

const orderService = {
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Vui lòng đăng nhập để đặt hàng");

      // Kiểm tra dữ liệu trước khi gửi
      console.log("🛒 Dữ liệu gửi lên API:", orderData);

      const response = await axiosInstance.post(
        "/order",
        orderData, // ✅ Gửi dữ liệu đặt hàng
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Đặt hàng thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi đặt hàng:", error.response?.data || error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Bạn cần đăng nhập với quyền admin");

      const response = await axiosInstance.get("/admin/order", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Lấy danh sách đơn hàng thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách đơn hàng:",
        error.response?.data || error
      );
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Vui lòng đăng nhập để xem đơn hàng");

      const response = await axiosInstance.get("/order", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Danh sách đơn hàng:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách đơn hàng:",
        error.response?.data || error
      );
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token)
        throw new Error("Vui lòng đăng nhập để xem chi tiết đơn hàng");

      const response = await axiosInstance.get(`/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy chi tiết đơn hàng:",
        error.response?.data || error
      );
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Vui lòng đăng nhập để hủy đơn hàng");

      const response = await axiosInstance.patch(
        `/order/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Đã hủy đơn hàng:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi hủy đơn hàng:", error.response?.data || error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token)
        throw new Error("Vui lòng đăng nhập để cập nhật trạng thái đơn hàng");

      const response = await axiosInstance.put(
        `/order/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Cập nhật trạng thái đơn hàng:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật trạng thái đơn hàng:",
        error.response?.data || error
      );
      throw error;
    }
  },
};

export default orderService;
