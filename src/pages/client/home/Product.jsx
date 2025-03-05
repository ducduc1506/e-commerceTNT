import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import productService from "../../../services/productService";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const Product = () => {
  const settings = {
    spaceBetween: 30,
    slidesPerView: 5,
    className: "w-full h-[420px]",
    navigation: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    modules: [Navigation, Pagination, Autoplay],
  };

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts({
          limit: 8,
          sort: "created_at",
        });
        console.log("Product list: ", response.products);
        setProducts(response.products);
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-8 mb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black">Sản Phẩm Nổi Bật</h2>
        <button className="text-sm text-gray-500">Xem thêm</button>
      </div>

      {/* Content */}
      <Swiper {...settings}>
        {products.map((product) => (
          <SwiperSlide
            key={product.id}
            className="flex flex-col h-full w-1/5 group border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="h-3/4 relative">
              <img
                src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Hiệu ứng hover */}
              <button
                onClick={() => navigate(`/products/${product.id}`)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Xem chi tiết
              </button>
            </div>
            <div className="h-1/4 p-3 flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold text-black cursor-pointer">
                {product.name}
              </h3>
              <p className="text-sm text-black">{product.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Product;
