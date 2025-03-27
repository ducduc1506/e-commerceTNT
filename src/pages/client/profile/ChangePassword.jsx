import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔄 Chuyển hướng trang
import { changePassword } from "../../../services/authService";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Thêm ô xác nhận mật khẩu mới
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    // 🛑 Kiểm tra mật khẩu nhập lại có khớp không
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      setIsPopupOpen(true);
      return;
    }

    try {
      const res = await changePassword(oldPassword, newPassword);
      setMessage(res.message);
      setIsPopupOpen(true);

      // ⏳ Chờ 2 giây rồi chuyển hướng về trang chủ
      setTimeout(() => {
        setIsPopupOpen(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(error.message);
      setIsPopupOpen(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-md bg-white">
      <h1 className="text-xl font-bold mb-4">Đổi mật khẩu</h1>

      <input
        type="password"
        placeholder="Mật khẩu cũ"
        className="border p-2 w-full outline-none mb-2"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Mật khẩu mới"
        className="border p-2 w-full outline-none mb-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        className="border p-2 w-full outline-none mb-4"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        className="bg-black text-white p-2 w-full rounded"
        onClick={handleChangePassword}
      >
        Đổi mật khẩu
      </button>

      {/* Popup hiển thị thông báo */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-center">{message}</p>
            <button
              className="bg-black text-white px-4 py-2 mt-2 w-full rounded"
              onClick={() => setIsPopupOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
