// src/pages/AdminLoginPage.js
import React, { useState } from 'react';
import '../assets/AdminLoginPage .css'; 

import backgroundImage from '../assets/image/banner2.jpg'; // Đảm bảo hình ảnh nền đúng

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = (e) => {
      e.preventDefault();
      // Logic xử lý đăng nhập
      alert('Đang đăng nhập với email: ' + email);
    };
  
    return (
      <div className="admin-login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="admin-login-container">
          <h2>VESXE - Admin</h2>
          
          <form onSubmit={handleLogin}>
            <div className="admin-input-group">
              <label htmlFor="email">Email</label> {/* Đổi từ "Số điện thoại" sang "Email" */}
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
            <button type="submit" className="admin-login-button">Đăng nhập</button>
          </form>
          <div className="admin-forgot-password">
            <a href="#">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    );
  };
export default AdminLoginPage;
