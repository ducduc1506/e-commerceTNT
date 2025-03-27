import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import orderService from "../../../services/orderService";
import zalopayService from "../../../services/zalopayService";
import { size } from "lodash";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, user } = location.state || { items: [], user: {} };

  console.log("🛒 Giỏ hàng:", items);

  // Lưu mã & tên của địa chỉ
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [specificAddress, setSpecificAddress] = useState(""); // 🏠 Địa chỉ cụ thể
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Danh sách địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (!items.length && savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart);
        location.state = { items: parsedItems, user }; // Gán lại dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi khôi phục giỏ hàng từ localStorage:", error);
      }
    }
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    setProvince(provinceCode);
    setDistrict("");
    setWard("");
    setDistricts([]);
    setWards([]);

    const selectedProvince = provinces.find(
      (p) => p.code.toString() === provinceCode
    );
    setProvinceName(selectedProvince ? selectedProvince.name : "");

    try {
      const res = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await res.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách huyện:", error);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    setDistrict(districtCode);
    setWard("");
    setWards([]);

    const selectedDistrict = districts.find(
      (d) => d.code.toString() === districtCode
    );
    setDistrictName(selectedDistrict ? selectedDistrict.name : "");

    try {
      const res = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await res.json();
      setWards(data.wards || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách xã:", error);
    }
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setWard(wardCode);

    const selectedWard = wards.find((w) => w.code.toString() === wardCode);
    setWardName(selectedWard ? selectedWard.name : "");
  };

  // Tính tổng tiền
  const totalPrice = items.reduce(
    (acc, item) => acc + item.product?.price * item.quantity,
    0
  );

  // Xử lý đặt hàng
  const handleConfirmPayment = async () => {
    if (!province || !district || !ward || !specificAddress) {
      toast.error("🚨 Vui lòng nhập đầy đủ thông tin giao hàng!", {
        autoClose: 3000,
      });
      return;
    }

    const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
    console.log("📍 Địa chỉ gửi lên:", fullAddress);
    console.log("💳 Phương thức thanh toán:", paymentMethod);

    try {
      const orderData = {
        address: fullAddress,
        totalPrice,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size_id: item.size_id,
          price: item.product.price,
        })),
      };

      if (paymentMethod === "ZaloPay") {
        // 🔹 Gửi API để lấy URL thanh toán (THÊM `items`)
        const paymentUrl = await zalopayService.createPaymentUrl(
          user.id,
          fullAddress,
          totalPrice,
          orderData.items // Gửi danh sách sản phẩm
        );

        if (!paymentUrl) {
          throw new Error("Không thể tạo URL thanh toán ZaloPay.");
        }

        // 🔥 Chuyển hướng người dùng đến trang thanh toán ZaloPay
        window.location.href = paymentUrl;
      } else {
        // 🔹 Nếu là COD, tạo đơn hàng ngay
        const order = await orderService.createOrder({
          ...orderData,
          paymentMethod: "cod",
          status: "pending",
        });

        toast.success("🎉 Đơn hàng đã được đặt thành công!", {
          autoClose: 3000,
        });

        setTimeout(() => navigate("/", { state: { orderId: order.id } }), 2000);
      }
    } catch (error) {
      console.error("❌ Lỗi đặt hàng:", error);
      toast.error("🚨 Lỗi đặt hàng, vui lòng thử lại!", { autoClose: 3000 });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-[30px] font-semibold text-center mb-4">
        Xác nhận thanh toán
      </h1>

      <div className="border-b border-gray-300 pb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2">
            <span>
              {item.product?.name} (x{item.quantity})
            </span>
            <span>
              {(item.product?.price * item.quantity).toLocaleString()}₫
            </span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
          <span>Tổng tiền:</span>
          <span>{totalPrice.toLocaleString()}₫</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mt-4 space-y-2 border-b border-gray-300 pb-4">
          <div className="flex items-center">
            <label className="w-32 text-gray-700 font-medium">Họ và tên:</label>
            <p className="flex-1">{user.name}</p>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700 font-medium">
              Số điện thoại:
            </label>
            <p className="flex-1">{user.phone}</p>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700 font-medium">Email:</label>
            <p className="flex-1">{user.email}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-1">
            Địa chỉ giao hàng
          </label>
          <div className="flex gap-4">
            <select
              value={province}
              onChange={handleProvinceChange}
              className="w-1/3 p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={district}
              onChange={handleDistrictChange}
              disabled={!province}
              className="w-1/3 p-2 border border-gray-300 rounded-lg disabled:bg-gray-200"
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={ward}
              onChange={handleWardChange}
              disabled={!district}
              className="w-1/3 p-2 border border-gray-300 rounded-lg disabled:bg-gray-200"
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <input
            className="mt-2 w-full p-2 border border-gray-300 rounded-lg outline-none"
            type="text"
            placeholder="Số nhà, thôn, xóm..."
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Thanh toán khi nhận hàng (COD)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="ZaloPay"
            checked={paymentMethod === "ZaloPay"}
            onChange={() => setPaymentMethod("ZaloPay")}
          />
          Thanh toán qua ZaloPay
        </label>
      </div>

      <button
        onClick={handleConfirmPayment}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
};

export default CheckoutPage;
