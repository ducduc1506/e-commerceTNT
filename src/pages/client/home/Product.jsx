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
    // pagination: { clickable: true },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false, // Tiếp tục autoplay ngay cả khi người dùng tương tác
    },
    modules: [Navigation, Pagination, Autoplay],
    // loop: true,
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
        <h2 className="text-2xl font-semibold">Sản Phẩm Nổi Bật</h2>
        <button className="text-sm text-gray-500">Xem thêm</button>
      </div>
      {/* Content */}
      <Swiper {...settings}>
        {products.map((product) => (
          <SwiperSlide
            key={product.id}
            className="flex flex-col h-full w-1/5 group border-[1px] border-solid" // Thêm group
          >
            <div className="h-3/4 bg-[#F3F5F7] p-4 flex flex-col justify-center">
              <div>
                <img
                  src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              {/* Nút hiện khi hover */}
              <button
                onClick={() => navigate(`/products/${product.id}`)}
                className="px-3 py-2 bg-slate-400 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out mt-4"
              >
                Xem chi tiết
              </button>
            </div>
            <div className="h-1/4 p-2">
              <h3 className="text-lg font-semibold text-black text-[18px] cursor-pointer">
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
