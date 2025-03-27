const CartItem = ({ item, onQuantityChange, onRemove, onSelect }) => {
  return (
    <tr className="border-b border-gray-200">
      <td className="p-3 text-center">
        <input
          type="checkbox"
          checked={item.selected || false}
          onChange={onSelect}
        />
      </td>
      <td className="p-3">
        <div className="flex items-center gap-4">
          <img
            src={
              `${import.meta.env.VITE_API_URL}${item.product?.main_image}` ||
              "/default-image.jpg"
            }
            alt={item.product?.name || "Sản phẩm"}
            className="w-16 h-16 object-cover"
          />
          <span>{item.product?.name || "Không có tên"}</span>
        </div>
      </td>
      <td className="p-3 text-center">
        <button
          className="px-2 py-1 bg-gray-200 rounded-lg"
          onClick={() => onQuantityChange(item.id, -1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="mx-2">{item.quantity || 1}</span>
        <button
          className="px-2 py-1 bg-gray-200 rounded-lg"
          onClick={() => onQuantityChange(item.id, 1)}
        >
          +
        </button>
      </td>
      <td className="p-3 text-center">
        {`${(item.product?.price || 0).toLocaleString("vi-VN")} VND`}
      </td>
      <td className="p-3 text-center">
        {`${((item.product?.price || 0) * (item.quantity || 1)).toLocaleString(
          "vi-VN"
        )} VND`}
      </td>
      <td className="p-3 text-center">
        <button className="text-red-500" onClick={() => onRemove(item.id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
