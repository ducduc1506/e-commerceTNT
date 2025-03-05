import { createSlice } from "@reduxjs/toolkit";

const loadUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Lỗi khi load user từ localStorage:", error);
    localStorage.removeItem("user"); // Xóa dữ liệu không hợp lệ
    return null;
  }
};

const initialState = {
  user: loadUser(),
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      // Đảm bảo lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);

      console.log("🔄 Auth state updated after login/refresh");
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      console.log("🔄 Auth state cleared after logout");
    },
    // Thêm action để đồng bộ state với localStorage
    syncAuthState: (state) => {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        state.accessToken = storedToken;
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
        console.log("🔄 Auth state synchronized with localStorage");
      } else if (!storedToken && state.accessToken) {
        // Nếu có token trong state nhưng không có trong localStorage
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        console.log("⚠️ Auth state reset due to missing localStorage data");
      }
    },
  },
});

export const { loginSuccess, logout, syncAuthState } = authSlice.actions;
export default authSlice.reducer;
