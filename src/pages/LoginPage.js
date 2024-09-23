// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../assets/LoginPage.css';
import Footer from '../components/Footer';
import logo from '../assets/image/logo.png';
import illustration from '../assets/image/illustration.jpg';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('register'); // Mặc định là tab "Đăng ký"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate(); // Tạo hook điều hướng

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic xử lý đăng nhập
    alert('Đang đăng nhập với email: ' + email);
    // Bạn có thể điều hướng sau khi đăng nhập thành công, nếu cần.
    // navigate('/dashboard');
  };
  
  const handleRegister = (e) => {
    e.preventDefault();
    // Giả sử đăng ký thành công, điều hướng sang trang nhập OTP
    alert('Đăng ký thành công! Chuyển sang trang nhập OTP.');
    navigate('/otp'); // Chuyển hướng tới trang OTP
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="FUTA Bus Lines Logo" />
        </div>
      </header>

      <div className="login-container">
        <div className="login-illustration">
          <img src={illustration} alt="Illustration" />
        </div>
        <div className="login-form">
          <div className="form-header">
            <button 
              className={`tab-button ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => handleTabChange('login')}
            >
              Đăng nhập
            </button>
            <button 
              className={`tab-button ${activeTab === 'register' ? 'active' : ''}`} 
              onClick={() => handleTabChange('register')}
            >
              Đăng ký
            </button>
          </div>

          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Nhập email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Nhập email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Mật khẩu</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="*******" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Đăng nhập</button>
              <div className="forgot-password">
                <a href="#">Quên mật khẩu</a>
              </div>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="register-email">Nhập email</label>
                <input 
                  type="email" 
                  id="register-email" 
                  placeholder="Nhập email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Đăng ký</button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
