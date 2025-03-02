const { ProductSize } = require("../models");

class ProductSizeService {
  // 🔹 Tạo nhiều size cùng lúc
  static async bulkCreate(sizes) {
    try {
      return await ProductSize.bulkCreate(sizes);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductSizeService;
