import { useNavigate } from "react-router-dom";
import { useState } from "react";

import BtnAddNew from "../../../components/button/BtnAddNew";
import ModalAdd from "./ModalAdd";
import useCategories from "../../../hooks/useCategories";

const Category = () => {
  const { categories, loading, error, refreshCategories } = useCategories();
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Mở modal
  const handleOpenModal = () => setIsOpenModal(true);

  // Đóng modal
  const handleCloseModal = () => setIsOpenModal(false);

  // Sau khi thêm danh mục, tải lại danh sách và đóng modal
  const handleCategoryAdded = async () => {
    await refreshCategories();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <span className="text-xl font-semibold">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-red-500">
        <span className="text-xl font-semibold">
          Error loading categories. Please try again.
        </span>
      </div>
    );
  }

  return (
    <>
      <ModalAdd
        isModalOpen={isOpenModal}
        closeModal={handleCloseModal}
        onCategoryAdded={handleCategoryAdded}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <BtnAddNew name="Add Category" onClick={handleOpenModal} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-4 text-center text-lg font-semibold">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white shadow-md rounded-md p-4 cursor-pointer group"
            >
              <div className="w-full h-48 bg-gray-200 rounded-md relative">
                <button
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-1 rounded-md opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-slate-200 z-10"
                  onClick={() => navigate(`/admin/categories/${category.id}`)}
                >
                  Edit
                </button>
                <img
                  src={
                    category?.image
                      ? `${apiUrl}${category.image}`
                      : "https://placehold.co/600x400"
                  }
                  alt={category.category_name}
                  className="w-full h-full object-cover rounded-md group-hover:opacity-70 transition duration-200"
                />
              </div>
              <h1 className="text-xl font-semibold mt-4">
                {category.category_name}
              </h1>
              <p className="text-gray-500">50 Items</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Category;
