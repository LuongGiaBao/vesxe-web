// src/pages/AuthPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from '@react-oauth/google';
import { message } from "antd";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
} from "../api/LoginApi";
import "../assets/AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý đăng nhập email/password
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await loginWithEmail(email, password);
      } else {
        response = await registerWithEmail(email, password, username);
      }

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        message.success(`${isLogin ? "Đăng nhập" : "Đăng ký"} thành công!`);

        // Kiểm tra nếu có thông tin thanh toán đã lưu
        const pendingBookingDetails = localStorage.getItem(
          "pendingBookingDetails"
        );
        if (pendingBookingDetails) {
          // Chuyển hướng đến trang thanh toán với thông tin đặt vé
          navigate("/payment", {
            state: { bookingDetails: JSON.parse(pendingBookingDetails) },
          });
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(`${isLogin ? "Đăng nhập" : "Đăng ký"} thất bại!`);
    } finally {
      setLoading(false);
    }
  };
  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  // Xử lý đăng nhập Google
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     const response = await loginWithGoogle(credentialResponse.credential);
  //     if (response.token) {
  //       localStorage.setItem('token', response.token);
  //       localStorage.setItem('user', JSON.stringify(response.user));

  //       message.success('Đăng nhập Google thành công!');
  //       navigate('/dashboard');
  //     }
  //   } catch (error) {
  //     message.error('Đăng nhập Google thất bại');
  //   }
  // };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>

        <form onSubmit={handleEmailAuth}>
          {!isLogin && ( // Chỉ hiển thị trường username trong form đăng ký
            <div className="form-group">
              <label>Tên người dùng:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                placeholder="Nhập tên người dùng"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        {/* <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              message.error("Đăng nhập Google thất bại");
            }}
          />
        </div> */}

        <p className="switch-auth">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          <button
            onClick={handleSwitchMode}
            className="switch-button"
            type="button"
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
