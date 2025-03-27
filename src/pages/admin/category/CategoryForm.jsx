import { useState } from "react";
import TextInput from "../../../components/input/TextInput";

const CategoryForm = ({ onSubmit, categories }) => {
  const [newCategory, setNewCategory] = useState("");
  const [categoryParent, setCategoryParent] = useState("");
  const [image, setImage] = useState(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ newCategory, categoryParent, image });
      }}
      className="flex flex-col gap-2"
    >
      {/* Tên danh mục */}
      <div className="px-4">
        {" "}
        <TextInput
          label="Tên danh mục:"
          id="categoryName"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nhập tên danh mục"
        />
      </div>

      {/* Danh mục cha */}
      <div className="px-4 flex flex-col gap-2">
        <label htmlFor="categoryParent">Danh mục cha:</label>
        <select
          id="categoryParent"
          className="outline-none px-3 py-2 border border-gray-400 rounded-md"
          value={categoryParent}
          onChange={(e) => setCategoryParent(e.target.value)}
        >
          <option value="">--Không--</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* Chọn ảnh */}
      <div className="px-4 flex flex-col gap-2">
        <label htmlFor="image">Ảnh:</label>
        <input
          id="image"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-400 rounded-md"
        />
      </div>

      {/* Nút submit */}
      <div className="px-4 flex flex-row-reverse gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700"
        >
          Thêm
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
