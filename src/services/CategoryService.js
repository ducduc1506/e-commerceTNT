const { Category } = require("../models");

class CategoryService {
  // 🔹 GET ALL CATEGORIES (bao gồm danh mục con)
  static async getAll() {
    try {
      return await Category.findAll({
        include: [
          {
            model: Category,
            as: "subcategories", // Lấy danh mục con
            attributes: ["id", "category_name", "image"],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  // 🔹 GET CATEGORY BY ID (kèm danh mục con)
  static async getById(id) {
    try {
      return await Category.findByPk(id, {
        include: [
          {
            model: Category,
            as: "subcategories",
            attributes: ["id", "category_name", "image"],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  // 🔹 CREATE CATEGORY
  static async create(category) {
    try {
      return await Category.create(category);
    } catch (error) {
      throw error;
    }
  }

  // 🔹 UPDATE CATEGORY
  static async update(id, updateCategory) {
    try {
      const categoryToUpdate = await Category.findByPk(id);
      if (categoryToUpdate) {
        await categoryToUpdate.update(updateCategory);
        return categoryToUpdate;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 DELETE CATEGORY (kiểm tra danh mục con trước khi xóa)
  static async delete(id) {
    try {
      const categoryToDelete = await Category.findByPk(id, {
        include: [{ model: Category, as: "subcategories" }],
      });

      if (!categoryToDelete) return null;

      // Nếu có danh mục con, không cho xóa
      if (categoryToDelete.subcategories.length > 0) {
        throw new Error("Không thể xóa danh mục có danh mục con");
      }

      await categoryToDelete.destroy();
      return categoryToDelete;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryService;
