import CategoryForm from "./CategoryForm";
import { categoryService } from "../../../services/categoryService";
import useCategories from "../../../hooks/useCategories";
import { useState } from "react";

const ModalAdd = ({ isModalOpen, closeModal, onCategoryAdded }) => {
  const { categories } = useCategories();
  const [error, setError] = useState("");

  const handleAddCategory = async ({ newCategory, categoryParent, image }) => {
    if (!newCategory.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const formData = new FormData();

      // Tạo object chứa thông tin category
      const categoryData = {
        category_name: newCategory.trim(),
        parent_id: categoryParent || null,
      };

      // Append category data dưới dạng chuỗi JSON
      formData.append("category_data", JSON.stringify(categoryData));

      // Append file nếu có
      if (image) {
        formData.append("image", image);
      }

      // Log để kiểm tra
      // console.log("Category Data:", categoryData);
      // console.log("Form Data:", formData);

      const response = await categoryService.createCategory(formData);
      console.log("Response:", response);

      setError("");
      await onCategoryAdded();
    } catch (error) {
      console.log("Error:", error.response?.data || error);
      setError(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục"
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-opacity-50 bg-black flex justify-center items-center ${
        isModalOpen ? "block" : "hidden"
      }`}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="w-[40%] pb-5 bg-white rounded-lg flex flex-col gap-2 overflow-hidden absolute top-[17%]">
        <div className="w-full h-[40px] bg-black flex justify-between items-center">
          <h1 className="text-white font-semibold px-4">Thêm danh mục mới</h1>
          <button
            className="text-white font-bold px-4 py-2"
            onClick={closeModal}
          >
            X
          </button>
        </div>

        {error && <div className="px-4 text-red-500">{error}</div>}

        <CategoryForm onSubmit={handleAddCategory} categories={categories} />
      </div>
    </div>
  );
};

export default ModalAdd;
