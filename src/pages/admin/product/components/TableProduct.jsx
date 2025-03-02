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

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await productService.deleteProduct(selectedProduct.id);

      // Fetch lại danh sách sản phẩm từ server
      const updatedList = await productService.getAllProducts();
      setProducts(updatedList?.products || []);

      // Đóng modal
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="p-3">Product</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Price</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Size</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-3 flex gap-2 items-center">
                <img
                  className="w-20 h-20"
                  src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
                  alt={product.name}
                />
                <p>{product.name}</p>
              </td>
              <td className="p-3">{product.sku}</td>
              <td className="p-3">${product.price}</td>
              <td className="p-3">
                {product.sizes?.reduce(
                  (total, size) => total + (size.quantity || 0),
                  0
                ) || 0}
              </td>
              <td className="p-3">
                {product.sizes
                  .filter((size) => size.quantity > 0) // Lọc các size có số lượng > 0
                  .sort((a, b) => {
                    const defaultSizes = ["S", "M", "L", "XL", "XXL"];
                    return (
                      defaultSizes.indexOf(a.size) -
                      defaultSizes.indexOf(b.size)
                    );
                  }) // Sắp xếp theo thứ tự chuẩn
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

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedProduct?.name}
      />
    </div>
  );
};

export default TableProduct;
