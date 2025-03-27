import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDeleteModal from "../../../../components/modal/ConfirmDeleteModal";
import productService from "../../../../services/productService";

const TableProduct = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (productId) => {
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      setErrorMessage(error?.message || "Xóa sản phẩm thất bại!");
      setIsErrorModalOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="p-3">Sản Phẩm</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Giá</th>
            <th className="p-3">Số Lượng</th>
            <th className="p-3">Kích Cỡ</th>
            <th className="p-3">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-3 flex gap-2 items-center">
                <img
                  className="w-20 h-20 object-cover"
                  src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
                  alt={product.name}
                />
                <p>{product.name}</p>
              </td>
              <td className="p-3">{product.sku}</td>
              <td className="p-3">
                {product.price.toLocaleString("vi-VN")} VNĐ
              </td>
              <td className="p-3">
                {product.sizes?.reduce(
                  (total, size) => total + (size.quantity || 0),
                  0
                ) || 0}
              </td>
              <td className="p-3">
                {product.sizes
                  .filter((size) => size.quantity > 0)
                  .sort((a, b) => {
                    const defaultSizes = ["S", "M", "L", "XL", "XXL"];
                    return (
                      defaultSizes.indexOf(a.size) -
                      defaultSizes.indexOf(b.size)
                    );
                  })
                  .map((size) => size.size)
                  .join(", ") || "N/A"}
              </td>
              <td className="p-3">
                <button
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  className="text-gray-600 hover:text-black pr-4"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(selectedProduct?.id)}
        itemName={selectedProduct?.name}
        isLoading={isDeleting}
      />

      {isErrorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800">Lỗi</h2>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsErrorModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableProduct;
