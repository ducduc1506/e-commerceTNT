import { useState } from "react";
import { addCustomer } from "../../../services/authService";

const AddCustomerModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [isSubmitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newCustomer = await addCustomer(form);
      onAdd(newCustomer);
      onClose();
    } catch (error) {
      console.error("Lỗi thêm khách hàng:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Thêm tài khoản mới</h2>
        <input
          name="name"
          placeholder="Tên"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          name="phone"
          placeholder="Số điện thoại"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          name="password"
          placeholder="Mật khẩu"
          type="password"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-black text-white p-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang thêm..." : "Thêm"}
        </button>
        <button onClick={onClose} className="ml-2 text-gray-500">
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddCustomerModal;
