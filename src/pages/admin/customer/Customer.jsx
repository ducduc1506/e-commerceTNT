import { useEffect, useState } from "react";
import {
  getCustomers,
  deleteCustomer,
  updateUserRole,
} from "../../../services/authService";
import AddCustomerModal from "./AddCustomerModal";
import { toast } from "react-toastify";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const users = await getCustomers();
      setCustomers(users);
    } catch (error) {
      console.error("Lỗi tải danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (newCustomer) => {
    try {
      toast.info("Đang thêm khách hàng...");
      await loadCustomers(); // Fetch lại danh sách từ API
      toast.success("Thêm khách hàng thành công!");
    } catch (error) {
      toast.error("Thêm khách hàng thất bại!");
      console.error("Lỗi thêm khách hàng:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Lỗi xóa khách hàng:", error);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    setEditingRole(null); // Luôn ẩn dropdown trước

    if (customers.find((user) => user.id === id)?.role === newRole) return; // Nếu không đổi giá trị thì return luôn

    try {
      await updateUserRole(id, newRole);
      const updatedUsers = await getCustomers();

      setCustomers((prevCustomers) =>
        prevCustomers.map((oldUser) => {
          const updatedUser = updatedUsers.find(
            (newUser) => newUser.id === oldUser.id
          );
          return updatedUser || oldUser;
        })
      );

      toast.success("Cập nhật vai trò thành công!");
    } catch (error) {
      toast.error("Lỗi cập nhật vai trò!");
      console.error("Lỗi cập nhật vai trò:", error);
    }
  };

  return (
    <div className="bg-white text-black shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-600">
        <h2 className="text-lg font-semibold">Danh sách khách hàng</h2>
        <button
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
          onClick={() => setModalOpen(true)}
        >
          Thêm khách hàng
        </button>
      </div>

      {isLoading ? (
        <p className="text-center py-4">Đang tải...</p>
      ) : (
        <table className="w-full text-left mt-4">
          <thead>
            <tr className="text-gray-800 border-b border-gray-300">
              <th className="p-3">ID</th>
              <th className="p-3">Tên khách hàng</th>
              <th className="p-3">Email</th>
              <th className="p-3">Số điện thoại</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-200"
              >
                <td className="p-3">#{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3 relative">
                  {editingRole === user.id ? (
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user.id, e.target.value)
                      }
                      onBlur={() => setEditingRole(null)} // Tắt dropdown khi mất focus
                      className="border border-gray-400 p-1 rounded bg-white"
                      autoFocus // Tự động focus vào dropdown
                    >
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị</option>
                    </select>
                  ) : (
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => setEditingRole(user.id)}
                    >
                      {user.role === "admin" ? "Quản trị" : "Người dùng"}
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Thêm Khách Hàng */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddCustomer}
      />
    </div>
  );
};

export default Customer;
