import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProduct from "../../../hooks/useProduct";

import Description from "./Description";
import Comment from "./Comment";
import Review from "./Review";
import Detail from "./Detail";

const ProductDetail = () => {
  const { productId } = useParams();
  const { product, loading, error } = useProduct(productId);
  useEffect(() => {
    console.log("🔥 Product cập nhật:", product);
  }, [product]); // Chỉ log khi product thay đổi
  const [activeTab, setActiveTab] = useState("description");

  const menuItems = [
    { name: "description", label: "Description" },
    { name: "comments", label: "Comments" },
    { name: "review", label: "Review" },
  ];

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (error) return <p>❌ Lỗi khi tải sản phẩm: {error.message}</p>;
  if (!product) return <p>⚠️ Không tìm thấy sản phẩm.</p>;

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return <Description desc={product.description} />;
      case "comments":
        return <Comment />;
      case "review":
        return <Review />;
      default:
        return null;
    }
  };
  return (
    <>
      {/* top */}
      <div className="pt-2">
        <p className="text-gray-500">
          Home - Shop - <span className="text-gray-900">Product</span>
        </p>
      </div>
      {/* Product */}
      <Detail productId={productId} />

      {/* Description / Comments / Review */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex gap-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`${
                activeTab === item.name
                  ? "border-b-2 border-black font-medium"
                  : ""
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {renderContent()}
      </div>
    </>
  );
};

export default ProductDetail;
