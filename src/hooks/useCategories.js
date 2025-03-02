import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/categoryService";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = async (categoryId, formData) => {
    try {
      const updatedCategory = await categoryService.updateCategory(
        categoryId,
        formData
      );

      // Debug
      // console.log("Updated Category:", updatedCategory);

      // Cập nhật state categories
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? updatedCategory : cat))
      );

      return updatedCategory;
    } catch (err) {
      console.error("Error in updateCategory hook:", err);
      setError(err.message);
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories((prev) =>
        prev.filter((cat) => cat.categoryId !== categoryId)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    setCategories,
    loading,
    error,
    refreshCategories: fetchCategories,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
