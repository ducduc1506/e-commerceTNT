const CartSummary = ({ subtotal, shippingCost, total, onOrder, disabled }) => {
  return (
    <div className="w-1/3 p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="font-medium text-lg mb-4">Tóm tắt đơn hàng</h2>
      <div className="flex justify-between border-b border-gray-300 py-3">
        <span>Subtotal</span>
        <span>{subtotal.toLocaleString("vi-VN")} VND</span>
      </div>
      <div className="flex justify-between border-b border-gray-300 py-3">
        <span>Shipping</span>
        <span>{shippingCost.toLocaleString("vi-VN")} VND</span>
      </div>
      <div className="flex justify-between text-lg font-semibold py-3">
        <span>Total</span>
        <span>{total.toLocaleString("vi-VN")} VND</span>
      </div>
      <button
        className="bg-black text-white py-3 w-full rounded-lg mt-4"
        disabled={disabled}
        onClick={onOrder}
      >
        Đặt hàng
      </button>
    </div>
  );
};

export default CartSummary;
