import { useState, useEffect, useRef } from "react";
import cartService from "../../../services/cartService"; // Import API giỏ hàng

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state cho API
  const shippingCost = 0;

  // Lấy giỏ hàng từ API
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await cartService.getCart();
        console.log("✅ Cart Data from API:", response);

        if (response?.cartItems) {
          // Sắp xếp lại theo thứ tự ID ban đầu để tránh nhảy loạn
          const validatedCart = response.cartItems.sort((a, b) => a.id - b.id);

          setCart(validatedCart);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("❌ Fetch Cart Error:", error);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  // Lưu giỏ hàng vào localStorage (chỉ khi thay đổi)
  const cartRef = useRef([]);
  useEffect(() => {
    if (JSON.stringify(cartRef.current) !== JSON.stringify(cart)) {
      localStorage.setItem("cart", JSON.stringify(cart));
      cartRef.current = cart; // Cập nhật giá trị lưu trữ
    }
  }, [cart]);

  // Thay đổi số lượng sản phẩm
  const handleQuantityChange = async (id, delta) => {
    let updatedCart = cart.map((item) => {
      if (item.id !== id) return item;

      const newQty = item.quantity + delta;

      if (newQty > item.productSize.quantity || newQty < 1) return item;

      return { ...item, quantity: newQty };
    });

    // Tìm lại số lượng mới sau khi cập nhật
    const newQuantity = updatedCart.find((item) => item.id === id)?.quantity;

    if (!newQuantity) return; // Nếu không có số lượng hợp lệ, dừng lại

    setCart(updatedCart);

    try {
      console.log("📡 Gửi API update số lượng:", newQuantity);
      await cartService.updateQuantity(id, newQuantity);

      // ✅ Load lại giỏ hàng từ DB để đảm bảo tính chính xác
      const refreshedCart = await cartService.getCart();
      setCart(refreshedCart.cartItems || []);
    } catch (error) {
      console.error("❌ Lỗi cập nhật số lượng:", error);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = async (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);

    try {
      await cartService.removeFromCart(id);
    } catch (error) {
      console.error("❌ Lỗi xóa sản phẩm:", error);
    }
  };

  // Chọn tất cả sản phẩm
  const handleSelectAll = () => {
    const newSelectAll = !cart.every((item) => item.selected);
    setCart(cart.map((item) => ({ ...item, selected: newSelectAll })));
  };

  // Tính tổng tiền
  const selectedItems = cart.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );
  const total = subtotal + shippingCost;

  return (
    <div className="w-full flex items-start gap-6 p-6">
      {/* Giỏ hàng */}
      <div className="w-2/3 bg-white p-4 rounded-lg border border-gray-300 shadow-md">
        <h1 className="text-[30px] font-semibold text-center mb-4">Giỏ hàng</h1>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : cart.length === 0 ? (
          <p className="text-center text-gray-500">Giỏ hàng trống</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={cart.every((item) => item.selected)}
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
                      checked={item.selected || false}
                      onChange={() =>
                        setCart((prev) =>
                          prev.map((p) =>
                            p.id === item.id
                              ? { ...p, selected: !p.selected }
                              : p
                          )
                        )
                      }
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          `${import.meta.env.VITE_API_URL}${
                            item.product?.main_image
                          }` || "/default-image.jpg"
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
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity || 1}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded-lg"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    {`${(item.product?.price || 0).toLocaleString(
                      "vi-VN"
                    )} VND`}
                  </td>
                  <td className="p-3 text-center">
                    {`${(
                      (item.product?.price || 0) * (item.quantity || 1)
                    ).toLocaleString("vi-VN")} VND`}
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
          <span>{subtotal.toLocaleString("vi-VN")} VND</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 py-3">
          <span>Shipping</span>
          <span>{shippingCost.toLocaleString("vi-VN")} VND</span>{" "}
        </div>
        <div className="flex justify-between text-lg font-semibold py-3">
          <span>Total</span>
          <span>{total.toLocaleString("vi-VN")} VND</span>
        </div>
        <button
          className="bg-black text-white py-3 w-full rounded-lg mt-4"
          disabled={selectedItems.length === 0}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default CartPage;
