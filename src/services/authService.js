import axios from "axios";
import { loginSuccess, logout } from "../redux/authSlice";

const API_URL = "http://localhost:8080/api";

export const login = (emailPhone, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { emailPhone, password },
      { withCredentials: true }
    );

    if (response.data.success) {
      const { user, accessToken } = response.data;

      // Đảm bảo lưu token trước khi dispatch action
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);

      // Thêm log để kiểm tra token
      console.log("✅ Login success, token saved:", accessToken);

      dispatch(loginSuccess({ user, accessToken }));
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || "Đăng nhập thất bại",
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("❌ Register Error:", error.response?.data || error);
    throw error.response?.data || { success: false, message: "Có lỗi xảy ra" };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

    // Xóa token khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    dispatch(logout());
  } catch (error) {
    console.error("❌ Logout Error:", error.response?.data || error);
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/refresh-token`,
      {},
      { withCredentials: true } // Đảm bảo gửi cookie kèm theo
    );

    if (response.data.accessToken) {
      // Lưu token mới vào localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.accessToken;
    }

    throw new Error("No access token returned");
  } catch (error) {
    console.error("🔴 Error refreshing token:", error);
    throw error;
  }
};
