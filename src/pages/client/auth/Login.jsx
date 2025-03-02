import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess as loginAction } from "../../../redux/authSlice"; // Đổi tên để tránh trùng
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/authService"; // Import hàm login từ service
import InputField from "./components/InputField";
import Layout from "./components/Layout";
import Title from "./components/Title";
import BtnSubmit from "./components/BtnSubmit";

const Login = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(login(account, password));
      console.log("Login Response:", data); // 👈 In ra dữ liệu trả về từ API

      if (data.success) {
        dispatch(
          loginAction({ user: data.user, accessToken: data.accessToken })
        );
        console.log("User stored in Redux:", data.user); // 👈 Kiểm tra Redux có lưu không
        navigate("/");
      } else {
        alert("Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Lỗi máy chủ!");
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
        <Title
          tileForm="Đăng Nhập"
          question="Bạn chưa có tài khoản?"
          link="/register"
          nameLink="Đăng ký"
        />
        <InputField
          type="text"
          placeholder="Email or Phone..."
          onChange={(e) => setAccount(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password..."
          onChange={(e) => setPassword(e.target.value)}
          isPassword={true}
        />
        <div className="mt-2 text-right">
          <a className="font-medium" href="#">
            Quên mật khẩu?
          </a>
        </div>
        <BtnSubmit name="Đăng Nhập" />
      </form>
    </Layout>
  );
};

export default Login;
