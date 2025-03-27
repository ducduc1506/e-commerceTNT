import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const zalopayService = {
  createPaymentUrl: async (userId, address, amount, items) => {
    try {
      const response = await axios.post(`${API_URL}/api/create-payment`, {
        userId,
        address,
        amount,
        items, // 🔹 Gửi danh sách sản phẩm lên API
      });

      console.log("🔹 Dữ liệu từ API:", response.data);
      return response.data.paymentUrl; // Trả về URL thanh toán
    } catch (error) {
      console.error("❌ Lỗi tạo URL thanh toán ZaloPay:", error);
      return null;
    }
  },
};

export default zalopayService;
