import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BtnSave from "../../../components/button/BtnSave";
import BtnCancel from "../../../components/button/BtnCancel";
import BtnDelete from "../../../components/button/BtnDelete";
import TextInput from "../../../components/input/TextInput";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";
import useCategories from "../../../hooks/useCategories";
import { categoryService } from "../../../services/categoryService";
import ProInCategory from "./ProdInCategory";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const { categories, updateCategory, deleteCategory } = useCategories();
  const [originalName, setOriginalName] = useState("");
  const [nameCategory, setNameCategory] = useState("");
  const [categoryParent, setCategoryParent] = useState("");
  const [image, setImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // Lấy thông tin danh mục khi component được render
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoryService.getCategoryById(categoryId);
        setNameCategory(data.category_name); // Lưu thông tin danh mục vào state
        setOriginalName(data.category_name); // Lưu tên ban đầu để so sánh khi lưu
        setCategoryParent(data.parent_id); // Lưu danh mục cha
      } catch (error) {
        console.error("Không tìm thấy danh mục:", error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      const categoryData = {
        category_name: nameCategory,
        parent_id: categoryParent || null,
      };

      // Append dữ liệu category dưới dạng JSON string
      formData.append("category_data", JSON.stringify(categoryData));

      if (image) {
        formData.append("image", image);
      }
      for (let pair of formData.entries()) {
        console.log("FormData:", pair[0], pair[1]);
      }

      // Gọi API update
      const updatedCategory = await updateCategory(categoryId, formData);
      console.log("Updated Category Response:", updatedCategory);

      alert("Cập nhật danh mục thành công!");
      navigate("/admin/categories");
    } catch (error) {
      alert(
        "Cập nhật thất bại: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(categoryId);
      alert("Xóa danh mục thành công!");
      navigate("/admin/categories"); // Điều hướng về trang danh sách
    } catch (error) {
      alert("Xóa thất bại!");
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button className="font-medium text-gray-500" onClick={handleBack}>
            ←Trở về
          </button>
          <h1 className="text-2xl font-semibold">{originalName}</h1>
        </div>
        <div className="flex gap-3">
          <BtnCancel onClick={handleBack} />
          <BtnSave name="Lưu" onClick={handleUpdate} />
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-6">
        <ProInCategory />
        <div className="w-1/3 h-80 py-4 px-3 rounded bg-white flex flex-col gap-4">
          <h1 className="text-lg font-semibold">Chi tiết danh mục</h1>
          <TextInput
            label="Tên danh mục:"
            placeholder={"Tên danh mục..."}
            id={"nameCategory"}
            value={nameCategory}
            onChange={(e) => setNameCategory(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label>Danh mục cha:</label>
            <select
              className="border border-gray-200 px-3 py-2 rounded-sm outline-none"
              value={categoryParent}
              onChange={(e) => setCategoryParent(e.target.value)}
            >
              <option value="">--Không--</option>
              {categories
                .filter((category) => category.id !== Number(categoryId)) //  Lọc bỏ chính nó
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label>Ảnh:</label>
            <input
              type="file"
              className="border border-gray-200 px-3 py-2 rounded-sm outline-none"
              onChange={(e) => setImage(e.target.files[0])} // Lưu ảnh vào state
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-3 mt-4">
        <BtnDelete
          name="Xóa danh mục"
          onClick={() => setIsDeleteModalOpen(true)}
        />
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={originalName}
      />
    </>
  );
};

export default CategoryDetail;
