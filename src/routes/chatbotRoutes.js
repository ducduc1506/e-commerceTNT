const express = require("express");
const {
  chatWithGemini,
  recommendSize,
  welcomeMessage,
} = require("../controllers/chatbotController.js");

const router = express.Router();

// API giao tiếp với Gemini AI
router.post("/chat", chatWithGemini);

// API tư vấn size theo chiều cao & cân nặng
router.post("/recommend-size", recommendSize);

// API chào mừng khi vào trang sản phẩm
router.post("/welcome-message", welcomeMessage);

module.exports = router;
