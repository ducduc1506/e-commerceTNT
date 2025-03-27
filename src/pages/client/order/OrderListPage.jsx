import { useEffect, useState } from "react";
import orderService from "../../../services/orderService";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import OrderDetail from "./OrderDetail";

Modal.setAppElement("#root"); // Định nghĩa phần tử gốc của ứng dụng để tránh cảnh báo

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orderStatusMap = {
    pending: { label: "Chờ xác nhận", color: "bg-yellow-500" },
    processing: { label: "Đang xử lý", color: "bg-blue-500" },
    shipped: { label: "Đang giao", color: "bg-purple-500" },
    delivered: { label: "Đã giao", color: "bg-green-500" },
    cancelled: { label: "Đã hủy", color: "bg-red-500" },
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getUserOrders();
      if (Array.isArray(res)) {
        setOrders(res);
      } else if (res?.data && Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Mã đơn</th>
              <th className="border p-2">Ngày đặt</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Tổng tiền</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">
                  {new Date(order.created_at).toLocaleString("vi-VN")}
                </td>
                <td className="border p-2">
                  <span
                    className={`px-3 py-[2px] text-white rounded ${
                      orderStatusMap[order.status]?.color
                    }`}
                  >
                    {orderStatusMap[order.status]?.label || "Không rõ"}
                  </span>
                </td>
                <td className="border p-2">
                  {order.total_price.toLocaleString()}₫
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => openModal(order)}
                    className="mr-2 px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      >
        <OrderDetail
          order={selectedOrder}
          orderStatusMap={orderStatusMap}
          closeModal={closeModal}
        />
      </Modal>
    </div>
  );
};

export default OrderListPage;
