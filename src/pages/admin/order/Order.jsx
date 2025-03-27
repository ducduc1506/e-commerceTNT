import { useEffect, useState } from "react";
import orderService from "../../../services/orderService";
import { Table, Tag, Button, Modal, Select, message } from "antd";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await orderService.updateOrderStatus(selectedOrder.id, status);
      message.success("Cập nhật trạng thái thành công!");
      fetchOrders();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Cập nhật thất bại!");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Danh sách trạng thái hợp lệ dựa trên trạng thái hiện tại
  const getAvailableStatusOptions = () => {
    return ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  };

  // Nhãn hiển thị trạng thái
  const optionLabels = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    shipped: "Đang giao hàng",
    delivered: "Đã nhận hàng",
    cancelled: "Đã hủy",
  };

  // Màu trạng thái
  const statusColors = {
    pending: "orange",
    confirmed: "blue",
    shipped: "purple",
    delivered: "green",
    cancelled: "red",
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    { title: "Khách hàng", dataIndex: ["user", "name"], key: "customer_name" },
    { title: "Tổng tiền", dataIndex: "total_price", key: "total_price" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {optionLabels[status]}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, order) => (
        <Button
          className="bg-black text-white hover:!bg-gray-800 hover:!text-white !border-none"
          onClick={() => handleViewOrder(order)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="id"
      />

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title="Chi tiết đơn hàng"
        width={800}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            className="hover:!text-black hover:!bg-gray-100 hover:!border-gray-300"
            onClick={() => setIsModalOpen(false)}
          >
            Đóng
          </Button>,
          <Button
            key="update"
            className="bg-black text-white hover:!bg-gray-800 hover:!text-white !border-none"
            onClick={handleUpdateStatus}
          >
            Cập nhật
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className=" space-y-4">
            <div className="grid grid-cols-3 gap-8">
              <p>
                <strong>Mã đơn:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Khách hàng:</strong> {selectedOrder.user.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.user.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedOrder.user.phone}
              </p>
              <p>
                <strong>Địa chỉ nhận hàng:</strong> {selectedOrder.address}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {formatCurrency(selectedOrder.total_price)}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {selectedOrder.payment_method}
              </p>
            </div>

            <div>
              <p className="font-semibold">Sản phẩm:</p>
              <ul className="space-y-1 border p-3 rounded-md bg-gray-50">
                {selectedOrder.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.product.name}</span>
                    <span>
                      {item.quantity} x {formatCurrency(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold">Trạng thái:</p>
              <Select
                value={status}
                onChange={(value) => setStatus(value)}
                style={{ width: "100%" }}
              >
                {Object.keys(optionLabels).map((option) => (
                  <Select.Option key={option} value={option}>
                    {optionLabels[option]}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Order;
