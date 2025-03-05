import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductImages = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(
    `${import.meta.env.VITE_API_URL}${product.main_image}`
  );

  return (
    <div className="w-[38%] flex flex-col gap-4">
      {/* Ảnh chính */}
      <div className="w-full h-auto bg-gray-200">
        <img
          src={selectedImage}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Swiper Thumbnail */}
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="w-full"
      >
        {/* Ảnh chính trong danh sách */}
        <SwiperSlide>
          <div
            className={`h-[140px] w-full cursor-pointer border-2 ${
              selectedImage ===
              `${import.meta.env.VITE_API_URL}${product.main_image}`
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() =>
              setSelectedImage(
                `${import.meta.env.VITE_API_URL}${product.main_image}`
              )
            }
          >
            <img
              src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>

        {/* Ảnh phụ */}
        {product.images.map((img) => (
          <SwiperSlide key={img.id}>
            <div
              className={`h-[140px] w-full cursor-pointer border-2 ${
                selectedImage ===
                `${import.meta.env.VITE_API_URL}${img.image_url}`
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() =>
                setSelectedImage(
                  `${import.meta.env.VITE_API_URL}${img.image_url}`
                )
              }
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${img.image_url}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImages;
