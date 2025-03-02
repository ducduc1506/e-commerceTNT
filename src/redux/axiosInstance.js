import axios from "axios";
import store from "./store";
import { logout } from "./authSlice";
import { refreshToken } from "../services/authService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // Gửi cookie (refreshToken)
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        store.dispatch(
          loginSuccess({
            user: store.getState().auth.user,
            accessToken: newToken,
          })
        );
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        store.dispatch(logout());
        window.location.href = "/login"; // Chuyển về login nếu hết hạn token
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
