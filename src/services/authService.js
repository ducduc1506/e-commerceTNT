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

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      `${API_URL}/change-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Change Password Error:", error.response?.data || error);
    throw (
      error.response?.data || { success: false, message: "Lỗi đổi mật khẩu" }
    );
  }
};

export const getCustomers = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.users;
};

export const addCustomer = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data.user;
};

export const deleteCustomer = async (id) => {
  const token = localStorage.getItem("accessToken");
  await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserRole = async (id, newRole) => {
  const token = localStorage.getItem("accessToken");
  await axios.put(
    `${API_URL}/users/${id}/role`,
    { role: newRole },
    { headers: { Authorization: `Bearer ${token}` } }
  );
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
