import { useEffect, useState } from "react";
import productService from "../../../services/productService";
import { useNavigate } from "react-router-dom";

const Recommend = () => {
  const navigate = useNavigate();
  const [recommendProducts, setRecommendProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendProducts = async () => {
      try {
        const response = await productService.getAllProducts({
          limit: 4,
          sort: "random",
        });
        setRecommendProducts(response.products);
      } catch (error) {
        console.error("Error fetching recommend products:", error);
      }
    };
    fetchRecommendProducts();
  }, []);

  return (
    <div className="w-[24%] flex flex-col gap-2 ml-4 border-gray-500">
      <div className="pb-1 pl-2 border-b-2 border-gray-500 font-medium">
        Có thể bạn quan tâm
      </div>
      {recommendProducts.map((product) => (
        <div
          key={product.id}
          className="pl-2 h-[120px] flex gap-2 cursor-pointer relative group  bg-white  overflow-hidden hover:shadow-lg transition-all"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          <div className="h-full w-[120px] bg-gray-200 relative">
            <img
              src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Hover toàn bộ */}
            <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Xem chi tiết
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-black transition font-medium group-hover:font-bold">
              {product.name}
            </p>
            <p className="text-black transition group-hover:font-medium">
              {product.price} VNĐ
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommend;
