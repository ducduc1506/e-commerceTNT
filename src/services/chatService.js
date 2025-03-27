import axiosInstance from "../redux/axiosInstance";

// 🟢 API gọi chatbot Gemini
export const getChatResponse = async (message, product = null) => {
  try {
    const response = await axiosInstance.post("/chat", {
      message,
      product: product
        ? {
            name: product.name,
            price: product.price,
            sizes: product.sizes.map((s) => s.size).join(", "), // Lấy danh sách size
          }
        : null,
    });
    return response.data.reply;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API chat:", error);
    return "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!";
  }
};

// 🟢 API tư vấn size theo chiều cao & cân nặng
export const getSizeRecommendation = async (height, weight) => {
  try {
    const response = await axiosInstance.post("/recommend-size", {
      height,
      weight,
    });
    return response.data.recommendedSize;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API tư vấn size:", error);
    return "Không tìm thấy size phù hợp.";
  }
};

// 🟢 API chào mừng khi vào trang sản phẩm
export const getWelcomeMessage = async (product) => {
  try {
    const response = await axiosInstance.post("/welcome-message", {
      productInfo: {
        name: product.name,
        price: product.price,
        sizes: product.sizes, // Giữ nguyên mảng size để xử lý bên backend
      },
    });
    return response.data.reply;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API chào mừng:", error);
    return "Xin lỗi, có lỗi xảy ra khi lấy thông tin sản phẩm.";
  }
};
