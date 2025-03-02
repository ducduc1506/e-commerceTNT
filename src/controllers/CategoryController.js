const fs = require("fs");
const path = require("path");
const CategoryService = require("../services/CategoryService");

class CategoryController {
  // ✅ GET ALL CATEGORIES
  static async index(req, res) {
    try {
      const categories = await CategoryService.getAll();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // ✅ GET CATEGORY BY ID
  static async show(req, res) {
    const { id } = req.params;
    try {
      const category = await CategoryService.getById(id);
      if (category) {
        return res.status(200).json(category);
      }
      return res.status(404).json({ message: "Category not found" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // ✅ CREATE CATEGORY (kiểm tra danh mục cha có tồn tại không)
  static async create(req, res) {
    try {
      const { category_name, parent_id } = JSON.parse(req.body.category_data);

      // Nếu có parent_id, kiểm tra xem danh mục cha có tồn tại không
      if (parent_id) {
        const parentCategory = await CategoryService.getById(parent_id);
        if (!parentCategory) {
          return res
            .status(400)
            .json({ message: "Parent category does not exist" });
        }
      }

      // Nếu có ảnh upload, lưu đường dẫn ảnh
      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/categories/${req.file.filename}`;
      }

      const categoryData = { category_name, parent_id, image: imagePath };
      const createdCategory = await CategoryService.create(categoryData);
      return res.status(201).json(createdCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // ✅ UPDATE CATEGORY (xóa ảnh cũ nếu cập nhật ảnh mới)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { category_name, parent_id } = JSON.parse(req.body.category_data);

      // Kiểm tra xem danh mục có tồn tại không
      const existingCategory = await CategoryService.getById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Nếu có parent_id, kiểm tra danh mục cha có tồn tại không
      if (parent_id) {
        const parentCategory = await CategoryService.getById(parent_id);
        if (!parentCategory) {
          return res
            .status(400)
            .json({ message: "Parent category does not exist" });
        }
      }

      let imagePath = existingCategory.image; // Giữ lại ảnh cũ nếu không có ảnh mới

      if (req.file) {
        imagePath = `/uploads/categories/${req.file.filename}`;

        // Xóa ảnh cũ nếu có
        if (existingCategory.image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            existingCategory.image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const updateData = {
        category_name,
        parent_id: parent_id || null,
        image: imagePath,
      };
      const updatedCategory = await CategoryService.update(id, updateData);
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // ✅ DELETE CATEGORY (chặn xóa danh mục có danh mục con)
  static async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedCategory = await CategoryService.delete(id);

      if (deletedCategory) {
        return res.status(200).json({ message: "Category deleted" });
      }
      return res.status(404).json({ message: "Category not found" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = CategoryController;
