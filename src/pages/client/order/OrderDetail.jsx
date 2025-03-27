const OrderDetail = ({ order, closeModal, orderStatusMap }) => {
  if (!order) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] relative z-[10000]">
      <button
        onClick={closeModal}
        className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full hover:bg-gray-700"
      >
        ✖
      </button>

      <h1 className="text-2xl font-semibold mb-4">
        Chi tiết đơn hàng #{order.id}
      </h1>

      <div className="mb-4 p-4 border rounded bg-gray-100">
        <p>
          <strong>Ngày đặt:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          <span
            className={`px-3 py-[2px] text-white rounded ${
              orderStatusMap[order.status]?.color
            }`}
          >
            {orderStatusMap[order.status]?.label || "Không rõ"}
          </span>
        </p>
        <p>
          <strong>Tổng tiền:</strong> {order.total_price.toLocaleString()}₫
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Sản phẩm trong đơn</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tên sản phẩm</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">Số lượng</th>
            <th className="border p-2">Giá</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.product.name}</td>
              <td className="border p-2">{item.size.size}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.price.toLocaleString()}₫</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetail;
