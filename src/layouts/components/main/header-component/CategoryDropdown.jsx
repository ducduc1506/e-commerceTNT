import { useNavigate } from "react-router-dom";
import { categoryService } from "../../../../services/categoryService";
import { useEffect, useState } from "react";

const CategoryDropdown = ({ category }) => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const result = await categoryService.getAllCategories();
      const children = result.filter((cat) => cat.parent_id === category.id);
      setSubCategories(children);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => navigate(`/products?category_id=${category.id}`)}
        className="hover:text-gray-600"
      >
        {category.category_name}
      </button>

      {isOpen && subCategories.length > 0 && (
        <div className="absolute left-0 top-full bg-white shadow-lg border border-gray-200 rounded-md w-48">
          {subCategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => navigate(`/products?category_id=${sub.id}`)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {sub.category_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
