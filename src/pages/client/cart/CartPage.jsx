import { useState, useEffect } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 100,
      quantity: 1,
      image: "https://via.placeholder.com/100",
      selected: true,
    },
    {
      id: 2,
      name: "Product 2",
      price: 150,
      quantity: 1,
      image: "https://via.placeholder.com/100",
      selected: true,
    },
  ]);

  const shippingCost = 0;

  // Cập nhật trạng thái chọn tất cả dựa vào các mục trong giỏ hàng
  const [selectAll, setSelectAll] = useState(
    cart.every((item) => item.selected)
  );

  useEffect(() => {
    setSelectAll(cart.length > 0 && cart.every((item) => item.selected));
  }, [cart]);

  const handleQuantityChange = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelect = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setCart((prev) =>
      prev.map((item) => ({ ...item, selected: newSelectAll }))
    );
  };

  const selectedItems = cart.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  return (
    <div className="w-full flex items-start gap-6 p-6">
      {/* Giỏ hàng */}
      <div className="w-2/3 bg-white p-4 rounded-lg border border-gray-300 shadow-md">
        <h1 className="text-[30px] font-semibold text-center mb-4">Giỏ hàng</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Giỏ hàng trống</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 text-center whitespace-nowrap">Sản phẩm</th>
                <th className="p-3 text-center whitespace-nowrap">Số lượng</th>
                <th className="p-3 text-center whitespace-nowrap">Giá</th>
                <th className="p-3 text-center whitespace-nowrap">
                  Thành tiền
                </th>
                <th className="p-3 text-center whitespace-nowrap">Xóa</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="px-2 py-1 bg-gray-200"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td className="p-3 text-center">${item.price.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="text-red-500"
                      onClick={() => handleRemove(item.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="w-1/3 p-4 border border-gray-300 rounded-lg shadow-md">
        <h2 className="font-medium text-lg mb-4">Tóm tắt đơn hàng</h2>
        <div className="flex justify-between border-b border-gray-300 py-3">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 py-3">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold py-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          className="bg-black text-white py-3 w-full rounded-lg mt-4"
          disabled={selectedItems.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
