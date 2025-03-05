import axios from "axios";
import store from "./store";
import { loginSuccess, logout } from "./authSlice";
import { refreshToken } from "../services/authService";

const API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 🛡️ Thêm interceptor request để gửi token nếu có
// Kiểm tra axiosInstance.js để đảm bảo gửi token đúng định dạng
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // Đảm bảo đúng định dạng header (cả chữ hoa/thường)
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      console.log(
        "🔑 Request with token:",
        accessToken.substring(0, 15) + "..."
      );
    } else {
      console.warn("⚠️ No access token available for request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Cải thiện interceptor response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log lỗi để debug
    console.error(
      "🔴 API Error:",
      error.response?.status,
      error.response?.data
    );

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("🔄 Attempting to refresh token...");

      try {
        const newToken = await refreshToken();

        if (newToken) {
          console.log("✅ Token refreshed successfully");

          // Cập nhật token vào Redux & localStorage
          const user = JSON.parse(localStorage.getItem("user") || "null");
          store.dispatch(loginSuccess({ user, accessToken: newToken }));

          // Gửi lại request với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Refresh token không trả về token mới");
        }
      } catch (refreshError) {
        console.error("🔴 Refresh token failed:", refreshError);

        // Chỉ logout và chuyển hướng nếu thực sự token hết hạn
        if (refreshError.response?.status === 401) {
          store.dispatch(logout());
          // Thêm delay trước khi chuyển hướng
          setTimeout(() => {
            window.location.href = "/login?expired=true";
          }, 100);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
