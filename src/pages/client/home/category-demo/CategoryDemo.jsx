import CategoryCard from "./CategoryCard";
import AoDemo from "../../../../assets/images/ao-demo.png";
import QuanDemo from "../../../../assets/images/quan-demo.png";

const CategoryDemo = () => {
  return (
    <div className="h-[664px] flex gap-[30px]">
      {/* left */}
      <div className="w-[50%] bg-[#F3F5F7] flex flex-col gap-4 px-[60px]">
        <div className="mt-3">
          <h1 className="category-title">Áo</h1>
          <a className="category-link" href="#">
            Xem ngay
          </a>
        </div>
        <div className="category-image">
          <img className="object-cover w-full h-full" src={AoDemo} alt="áo" />
        </div>
      </div>
      {/* Right */}
      <div className="w-[50%] flex flex-col gap-[30px]">
        <CategoryCard title="Quần" link="Xem ngay" image={QuanDemo} />
        <CategoryCard title="Quần" link="Xem ngay" image={QuanDemo} />
      </div>
    </div>
  );
};

export default CategoryDemo;
