import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../../services/orderService";

const RecentOrder = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-blue-500";
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-orange-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "delivered":
        return "Đã giao";
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => navigate("/orders")}
        >
          Xem tất cả
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="p-3">Mã đơn hàng</th>
            <th className="p-3">Ngày đặt</th>
            <th className="p-3">Khách hàng</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 5).map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-3">#{order.id}</td>
              <td className="p-3">
                {new Date(order.created_at).toLocaleDateString("vi-VN")}
              </td>
              <td className="p-3">{order.user?.name}</td>
              <td className={`p-3 ${getStatusColor(order.status)}`}>
                {translateStatus(order.status)}
              </td>
              <td className="p-3">{formatCurrency(order.total_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrder;
