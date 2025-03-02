import { useState, useEffect } from "react";
import { categoryService } from "../../../../services/categoryService";

const Filter = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: "",
    sort: "newest",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4">
      <select
        name="category_id"
        className="p-2 border border-gray-300 text-gray-700"
        value={filters.category_id}
        onChange={handleChange}
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.category_name}
          </option>
        ))}
      </select>

      <select
        name="sort"
        className="p-2 border border-gray-300 text-gray-700"
        value={filters.sort}
        onChange={handleChange}
      >
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
        <option value="price_asc">Giá thấp đến cao</option>
        <option value="price_desc">Giá cao đến thấp</option>
      </select>
    </div>
  );
};

export default Filter;
