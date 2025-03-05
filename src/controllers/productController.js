const ProductService = require("../services/productService");
const ProductSizeService = require("../services/productSizeService");
const CategoryService = require("../services/CategoryService");

class ProductController {
  // 🔹 Tạo sản phẩm
  static async create(req, res) {
    try {
      const { sku, name, description, category_id, price, sizes } = JSON.parse(
        req.body.product_data
      );
      console.log("📩 Dữ liệu nhận từ frontend:", req.body);
      console.log("📂 File upload:", req.files);

      // 🔹 Kiểm tra SKU có tồn tại không
      const existingProduct = await ProductService.getBySKU(sku);
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "SKU đã tồn tại, vui lòng chọn SKU khác" });
      }

      // 🔹 Kiểm tra category_id có tồn tại không
      const categoryExists = await CategoryService.getById(category_id);
      if (!categoryExists) {
        return res.status(400).json({ message: "Category ID không tồn tại" });
      }

      // 🔹 Xử lý ảnh chính
      let mainImagePath = null;
      if (req.files["main_image"] && req.files["main_image"][0]) {
        mainImagePath = `/uploads/products/${req.files["main_image"][0].filename}`;
      }

      // 🔹 Xử lý ảnh phụ
      let subImages = [];
      if (req.files["sub_images"]) {
        subImages = req.files["sub_images"].map(
          (file) => `/uploads/products/${file.filename}`
        );
      }

      const productData = {
        sku,
        name,
        description,
        category_id,
        price,
        main_image: mainImagePath,
      };

      // 🔹 Tạo sản phẩm trước
      const createdProduct = await ProductService.create(
        productData,
        subImages
      );

      // 🔹 Nếu có size, lưu vào bảng `product_sizes`
      if (sizes && sizes.length > 0) {
        const sizesData = sizes.map((size) => ({
          product_id: createdProduct.id,
          size: size.size,
          quantity: size.quantity,
        }));

        await ProductSizeService.bulkCreate(sizesData);
      }

      return res.status(201).json(createdProduct);
    } catch (error) {
      console.error("❌ Lỗi khi tạo sản phẩm:", error);

      if (error.name === "SequelizeValidationError") {
        return res
          .status(400)
          .json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({ message: "Category ID không hợp lệ" });
      }

      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  }

  // 🔹 Lấy tất cả sản phẩm với phân trang
  static async getAll(req, res) {
    try {
      const {
        search,
        category_id,
        price_range,
        sort,
        page = 1,
        limit = 10,
      } = req.query;

      const data = await ProductService.getAllWithPagination({
        search,
        category_id,
        price_range,
        sort,
        page,
        limit,
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 🔹 Lấy sản phẩm theo ID
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductService.getById(id);
      if (product) {
        return res.status(200).json(product);
      }
      return res.status(404).json({ message: "Product not found" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 🔹 Cập nhật sản phẩm
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { product_data, removed_images } = req.body;

      // Parse product_data từ frontend
      const updateData = JSON.parse(product_data);
      const removedImages = JSON.parse(removed_images || "[]"); // Danh sách ảnh phụ cần xóa

      // Ảnh chính (chỉ có 1 file)
      const mainImage = req.files["main_image"]
        ? req.files["main_image"][0]
        : null;

      // Ảnh phụ (có thể có nhiều)
      const subImages = req.files["sub_images"] || [];

      const updatedProduct = await ProductService.update(
        id,
        updateData,
        mainImage,
        subImages,
        removedImages
      );

      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // 🔹 Xóa sản phẩm
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductService.delete(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ProductController;
