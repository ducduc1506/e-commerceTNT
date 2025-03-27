const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// Load bảng size từ file JSON, thêm kiểm tra lỗi
let sizes = {};
try {
  sizes = JSON.parse(fs.readFileSync("src/data/sizes.json", "utf8"));
} catch (error) {
  console.error("❌ Lỗi đọc file sizes.json:", error.message);
}

// 🟢 API chatbot Gemini
const chatWithGemini = async (req, res) => {
  const { message, productInfo } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Tin nhắn không được để trống" });
  }

  try {
    // Xử lý thông tin sản phẩm nếu có
    let productContext = "";
    if (productInfo) {
      const availableSizes =
        productInfo.sizes?.filter((s) => s.quantity > 0) || [];
      const sizeList =
        availableSizes.map((s) => s.size).join(", ") || "Không có";

      productContext = `Người dùng đang xem sản phẩm: 
      - **Tên:** ${productInfo.name}  
      - **Giá:** ${productInfo.price.toLocaleString()} VNĐ  
      - **Size còn hàng:** ${sizeList}.`;
    }

    // Hướng dẫn chatbot về tư vấn size
    const context = `${productContext} 
    Bạn là trợ lý chatbot tư vấn size quần áo bằng tiếng Việt. 
    Dưới đây là bảng size cho nam: ${JSON.stringify(sizes["men"])}. 
    Khi người dùng hỏi về size, hãy sử dụng dữ liệu này để tư vấn phù hợp.`;

    const prompt = `${context}\n\nNgười dùng: ${message}\nTrợ lý:`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    const reply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Phản hồi không hợp lệ từ Gemini API");

    res.json({ reply });
  } catch (error) {
    console.error("❌ Lỗi API Gemini:", error.response?.data || error.message);
    res.status(500).json({ error: "Lỗi khi gửi tin nhắn đến Gemini API" });
  }
};

// 🟢 API tư vấn size dựa vào chiều cao & cân nặng
const recommendSize = (req, res) => {
  const { height, weight, availableSizes } = req.body;

  if (!height || !weight) {
    return res
      .status(400)
      .json({ error: "Vui lòng cung cấp chiều cao và cân nặng" });
  }

  const sizeTable = sizes["men"];
  if (!sizeTable) {
    return res.status(500).json({ error: "Không tìm thấy dữ liệu size" });
  }

  let recommendedSize = "Không tìm thấy size phù hợp";
  for (const [size, range] of Object.entries(sizeTable)) {
    const [minH, maxH] = range.height.split("-").map(Number);
    const [minW, maxW] = range.weight.split("-").map(Number);

    if (
      height >= minH &&
      height <= maxH &&
      weight >= minW &&
      weight <= maxW &&
      (!availableSizes || availableSizes.includes(size))
    ) {
      recommendedSize = size;
      break;
    }
  }

  res.json({ recommendedSize });
};

// 🟢 API chào mừng khi vào trang sản phẩm
const welcomeMessage = (req, res) => {
  const { productInfo } = req.body;

  if (!productInfo) {
    return res.status(400).json({ error: "Thiếu thông tin sản phẩm" });
  }

  const { name, price, sizes: productSizes } = productInfo;

  // Lọc size còn hàng
  const availableSizes = productSizes?.filter((s) => s.quantity > 0) || [];
  const sizeInfo =
    availableSizes.length > 0
      ? availableSizes
          .map((s) => `- Size ${s.size} (Còn ${s.quantity} cái) <br/>`)
          .join("\n")
      : "❌ Hiện sản phẩm này đã hết hàng.";

  const message = `👕 Bạn đang xem sản phẩm: 
  - ${name} <br/>
  - Giá: ${price.toLocaleString()} VNĐ <br/>
  - Size còn hàng:  
  ${sizeInfo} <br/> Mình có thể hỗ trợ gì cho bạn không? 😊`;

  res.json({ reply: message });
};

module.exports = { chatWithGemini, recommendSize, welcomeMessage };
