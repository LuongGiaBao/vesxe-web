// src/components/Footer.js
import React from 'react';
import '../assets/style.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>© 2024 Hệ Thống Đặt Vé Xe. All rights reserved.</p>
        <div className="footer-links">
          <a href="/terms">Điều khoản sử dụng</a>
          <a href="/privacy">Chính sách bảo mật</a>
          <a href="/contact">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
