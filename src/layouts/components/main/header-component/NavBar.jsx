import { useEffect, useState } from "react";
import { categoryService } from "../../../../services/categoryService";
import CategoryDropdown from "./CategoryDropdown";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryService.getAllCategories();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="flex gap-10 text-[18px] font-[400] text-gray-900">
      <button onClick={() => navigate("/")} className="hover:text-gray-600">
        Home
      </button>
      {categories
        .filter((cat) => cat.parent_id === null)
        .map((category) => (
          <CategoryDropdown
            key={category.id}
            category={category}
            subCategories={categories.filter(
              (cat) => cat.parent_id === category.id
            )}
          />
        ))}
    </nav>
  );
};

export default Navbar;
