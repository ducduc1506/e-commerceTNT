import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import productService from "../../../services/productService";
import cartService from "../../../services/cartService";
import Recommend from "./Recommend";
import ProductImages from "./ProductImages";
import ChatbotPopup from "./ChatbotPopup";

const Detail = ({ productId }) => {
  const [sizeActive, setSizeActive] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchProductById = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductById(productId);
        setProduct(response);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        toast.error("Không thể lấy dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product)
    return <div className="text-red-500">Sản phẩm không tồn tại.</div>;

  const handleSizeActive = (size) => setSizeActive(size);

  const handleAddToCart = async () => {
    if (!sizeActive) {
      toast.error("Vui lòng chọn size trước khi thêm vào giỏ hàng.");
      return;
    }

    const selectedSize = product.sizes.find((size) => size.size === sizeActive);
    if (!selectedSize) {
      toast.error("Size không hợp lệ.");
      return;
    }

    try {
      await cartService.addToCart(product.id, selectedSize.id, 1);
      toast.success("🛒 Sản phẩm đã thêm vào giỏ hàng!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  const availableSizes = product.sizes.filter((size) => size.quantity > 0);

  return (
    <div className="flex flex-row gap-4">
      <ToastContainer />
      <ProductImages product={product} />

      <div className="w-[38%] flex flex-col gap-4">
        <div className="pb-2 flex flex-col gap-4 border-b-2 border-gray-300">
          <h1 className="font-medium text-[24px]">{product.name}</h1>
          <p className="text-gray-500">
            Đối với phụ kiện (ví, mắt kính, dây lưng...), vui lòng chọn size "S"
            để đặt hàng.
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

        {availableSizes.length === 0 ? (
          <p className="text-red-500 font-bold">
            Sản phẩm này hiện đã hết hàng.
          </p>
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            <p>Chọn size:</p>
            <div className="flex gap-4">
              {availableSizes.map((size) => (
                <button
                  key={size.size}
                  onClick={() => handleSizeActive(size.size)}
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
        )}

        <button
          onClick={handleAddToCart}
          disabled={!sizeActive}
          className={`w-full px-4 py-2 text-white text-[18px] font-medium rounded-lg transition ${
            sizeActive ? "bg-black" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      <Recommend />
      <ChatbotPopup product={product} />
    </div>
  );
};

export default Detail;
