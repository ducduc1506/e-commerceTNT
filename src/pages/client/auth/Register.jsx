import { useState } from "react";
import InputField from "./components/InputField";
import Layout from "./components/Layout";
import Title from "./components/Title";
import BtnSubmit from "./components/BtnSubmit";
import { register } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      const res = await register({ name, email, phone, password });
      setSuccess("Đăng ký thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại!");
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
        <Title
          tileForm={"Đăng Ký"}
          question={"Bạn đã có tài khoản?"}
          link={"/login"}
          nameLink={"Đăng nhập"}
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <InputField
          type="text"
          placeholder="Your Name..."
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          type="email"
          placeholder="Your Email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="Your Phone..."
          onChange={(e) => setPhone(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Your Password..."
          onChange={(e) => setPassword(e.target.value)}
          isPassword={true}
        />
        <InputField
          type="password"
          placeholder="Confirm Password..."
          onChange={(e) => setConfirmPassword(e.target.value)}
          isPassword={true}
        />
        <BtnSubmit name={"Đăng Ký"} />
      </form>
    </Layout>
  );
};

export default Register;
