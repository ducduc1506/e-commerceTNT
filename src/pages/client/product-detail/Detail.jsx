import { useEffect, useState } from "react";
import productService from "../../../services/productService";

const Detail = ({ productId }) => {
  const recomendProducts = [
    {
      id: 1,
      name: "Name product",
      img: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Name product",
      img: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      name: "Name product",
      img: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      name: "Name product",
      img: "https://via.placeholder.com/300",
    },
  ];

  console.log("🔍 productId:", productId);
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const fecthProductById = async () => {
      try {
        const response = await productService.getProductById(productId);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fecthProductById();
  }, []);
  return (
    <div className="flex flex-row gap-4">
      {/* image */}
      <div className="w-[38%] flex flex-col gap-4">
        <div className="w-full h-auto bg-gray-200">
          <img
            src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
            alt={product.name}
          />
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-500 h-[140px] w-1/3">
            <img src="https://via.placeholder.com/300" alt="product" />
          </div>
          <div className="bg-slate-500 h-[140px] w-1/3">
            <img src="https://via.placeholder.com/300" alt="product" />
          </div>
          <div className="bg-slate-500 h-[140px] w-1/3">
            <img src="https://via.placeholder.com/300" alt="product" />
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="w-[38%] flex flex-col gap-4 ">
        <div className="pb-2 flex flex-col gap-4 border-b-2 border-gray-300">
          <h1 className="font-medium text-[24px]">{product.name}</h1>
          <p className="text-gray-500">
            Buy one or buy a few and make every space where you sit more
            convenient. Light and easy to move around with removable tray top,
            handy for serving snacks.
          </p>
          <p className="text-[20px] text-gray-900 font-medium">
            {product.price}{" "}
            <span className="text-gray-500 scale-[0.9] inline-block line-through">
              $200.00
            </span>
          </p>
        </div>
        <div className="pb-2 border-b-2 border-gray-300">
          <p className="text-gray-600 font-medium">
            SKU:{" "}
            <span className="px-2 bg-black text-white rounded-md">
              {product.sku}
            </span>
          </p>
          <p className="text-gray-600 font-medium">
            Category:{" "}
            <span className="px-2 bg-black text-white rounded-md">
              {product.categoryData.category_name}
            </span>
          </p>
        </div>
        <div className="pb-2 border-b-2 border-gray-300">
          <p>Offer expires in:</p>
          <p>3 days 6 hours 30 minutes 7 seconds</p>
        </div>
        <div className="flex flex-col gap-4 pb-4">
          <p>Choose size:</p>
          <div className="flex gap-4">
            {product.sizes
              .filter((size) => size.quantity > 0) // Chỉ hiển thị size còn hàng
              .map((size) => (
                <button
                  key={size.size}
                  className="h-[40px] w-[40px] border-2 border-gray-400 font-bold"
                >
                  {size.size}
                </button>
              ))}
          </div>
        </div>
        <div>
          <button className="w-full px-4 py-2 bg-black text-white text-[18px] font-medium rounded-lg">
            Add to Cart
          </button>
        </div>
      </div>
      {/* Recommend */}
      <div className="w-[24%] flex flex-col gap-2 ml-4 border-gray-500">
        <div className="pb-1 pl-2 border-b-2 border-gray-500 font-medium">
          Có thể bạn quan tâm
        </div>
        {recomendProducts.map((product) => (
          <div key={product.id} className="pl-2 h-[120px] flex gap-2">
            <div className="h-full w-[120px] bg-gray-200">
              <img src={product.img} alt="product" />
            </div>
            <div>
              <p>{product.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
