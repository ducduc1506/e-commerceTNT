import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const PaymentReturn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const createOrder = async () => {
      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
      if (pendingOrder) {
        try {
          await axios.post(`${API_URL}/api/order`, pendingOrder);
          localStorage.removeItem("pendingOrder"); // 🗑️ Xóa sau khi tạo xong
        } catch (error) {
          console.error("Lỗi tạo đơn hàng:", error);
        }
      }
    };

    createOrder();

    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold text-green-600">
        Thanh toán thành công!
      </h2>
      <p className="text-gray-600">
        Bạn sẽ được chuyển về trang chủ trong giây lát...
      </p>
    </div>
  );
};

export default PaymentReturn;
