import { useEffect, useState } from "react";
import productService from "../../../services/productService";
import Recommend from "./Recommend";
import ProductImages from "./ProductImages";
import cartService from "../../../services/cartService";

const Detail = ({ productId }) => {
  const [sizeActive, setSizeActive] = useState(null);

  const [product, setProduct] = useState(null);
  useEffect(() => {
    console.log("🔍 productId useEffect:", productId);
    const fecthProductById = async () => {
      try {
        const response = await productService.getProductById(productId);
        console.log(response);
        setProduct(response);
      } catch (error) {
        console.log(error);
      }
    };
    fecthProductById();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleSizeActive = (size) => {
    setSizeActive(size);
  };

  const handleAddToCart = async () => {
    if (!sizeActive) return;

    const selectedSize = product.sizes.find((size) => size.size === sizeActive);

    console.log("Debug - sizeActive:", sizeActive);
    console.log("Debug - selectedSize:", selectedSize);

    if (!selectedSize) {
      alert("Size không hợp lệ!");
      return;
    }

    console.log("Debug - product_id:", product.id);
    console.log("Debug - size_id:", selectedSize.id);

    try {
      await cartService.addToCart(product.id, selectedSize.id, 1);
      alert("🛒 Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  return (
    <div className="flex flex-row gap-4">
      {/* image */}
      <ProductImages product={product} />
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
                  onClick={() => handleSizeActive(size.size)}
                  key={size.size}
                  className={`h-[40px] w-[40px] border-2 font-bold transition ${
                    sizeActive === size.size
                      ? "border-black"
                      : "border-gray-400"
                  }`}
                >
                  {size.size}
                </button>
              ))}
          </div>
        </div>
        <div>
          <button
            onClick={handleAddToCart}
            disabled={!sizeActive} // Disable nếu chưa chọn size
            className={`w-full px-4 py-2 text-white text-[18px] font-medium rounded-lg transition ${
              sizeActive ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
      {/* Recommend */}
      <Recommend />
    </div>
  );
};

export default Detail;
