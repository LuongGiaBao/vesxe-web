// src/pages/AdminLoginPage.js
import React, { useState } from "react";
import "../assets/AdminLoginPage .css";
import backgroundImage from "../assets/image/banner2.jpg"; // Đảm bảo hình ảnh nền đúng // Đảm bảo hình ảnh nền đúng
import { loginAdmin } from "../api/LoginApi";
import { apiClient } from "../services/apiservices";
import { useNavigate } from "react-router-dom";
// Import hàm đăng nhập

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm trạng thái lỗi
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/local", {
        identifier: email,
        password: password,
      });

      // Kiểm tra trạng thái confirmed
      if (!response.data.user.confirmed) {
        alert(
          "Tài khoản chưa được xác nhận. Vui lòng kiểm tra email để xác nhận tài khoản."
        );
        return;
      }

      // Nếu tài khoản đã được xác nhận
      const token = response.data.jwt;
      localStorage.setItem("token", token);
      alert("Đăng nhập thành công!");

      // Chuyển hướng đến trang admin/dashboard
      navigate("/admin/dashboard"); // Thay đổi đường dẫn nếu cần
    } catch (error) {
      alert("Đăng nhập thất bại: " + error.response.data.message);
    }
  };

  return (
    <div
      className="admin-login-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="admin-login-container">
        <h2>VESXE - Admin</h2>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Hiển thị thông báo lỗi */}
        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-button">
            Đăng nhập
          </button>
        </form>
        <div className="admin-forgot-password">
          <a href="#">Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
