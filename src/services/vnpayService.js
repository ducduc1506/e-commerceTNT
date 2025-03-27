import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // URL của backend của bạn

const vnpayService = {
  createPaymentUrl: async (orderData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/create_payment_url`,
        orderData,
        { headers: { "Content-Type": "application/json" } } // Thêm dòng này
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi tạo URL thanh toán:", error);
      throw error;
    }
  },

  getPaymentStatus: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/api/payment_return`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái thanh toán:", error);
      throw error;
    }
  },
};

export default vnpayService;
