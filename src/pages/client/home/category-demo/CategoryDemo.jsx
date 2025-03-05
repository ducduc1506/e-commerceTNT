import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { categoryService } from "../../../../services/categoryService";

const CategoryDemo = () => {
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const allCategories = await categoryService.getAllCategories();
      const parents = allCategories.filter((cat) => cat.parent_id === null); // Chỉ lấy category cha
      setParentCategories(parents);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="h-[664px] flex gap-[30px]">
      {parentCategories.length > 0 ? (
        <>
          {/* Left - Danh mục cha đầu tiên */}
          <div className="w-[50%] bg-[#F3F5F7] flex flex-col gap-4 px-[60px]">
            <div className="mt-3">
              <h1 className="category-title">
                {parentCategories[0]?.category_name}
              </h1>
              <a
                className="category-link"
                href={`/products?category_id=${parentCategories[0]?.id}`}
              >
                Xem ngay
              </a>
            </div>
            <div className="category-image">
              <img
                className="object-cover w-full h-full"
                src={parentCategories[0]?.image}
                alt={parentCategories[0]?.category_name}
              />
            </div>
          </div>

          {/* Right - Các danh mục cha còn lại */}
          <div className="w-[50%] flex flex-col gap-[30px]">
            {parentCategories.slice(1).map((category) => (
              <CategoryCard
                key={category.id}
                title={category.category_name}
                link="Xem ngay"
                image={category.image}
                id={category.id}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Đang tải danh mục...</p>
      )}
    </div>
  );
};

export default CategoryDemo;
