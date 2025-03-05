import { useNavigate } from "react-router-dom";

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full grid grid-cols-4 gap-8">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            className="w-full bg-white shadow-md rounded-lg overflow-hidden group relative border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="w-full h-[300px] bg-gray-100 relative">
              <img
                src={`${import.meta.env.VITE_API_URL}${product.main_image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => navigate(`/products/${product.id}`)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Xem chi tiết
              </button>
            </div>
            <div className="p-4 flex flex-col items-center text-center">
              <h3 className="font-medium text-lg text-black">{product.name}</h3>
              <p className="text-gray-700 text-xl font-bold">
                {product.price.toLocaleString()}₫
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-4">
          Không có sản phẩm nào.
        </p>
      )}
    </div>
  );
};

export default ProductList;
