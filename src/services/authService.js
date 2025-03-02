import axios from "axios";
import { loginSuccess, logout } from "../redux/authSlice";

export const login = (emailPhone, password) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:8080/api/login", {
      emailPhone,
      password,
    });

    if (response.data.success) {
      dispatch(loginSuccess(response.data));
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Đăng nhập thất bại" };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/register",
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Có lỗi xảy ra";
  }
};

export const logoutUser = () => (dispatch) => {
  axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
  dispatch(logout());
};
