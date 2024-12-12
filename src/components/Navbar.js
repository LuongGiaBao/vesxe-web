// src/components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/image/logo.png"; // Import logo từ thư mục assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // Import icon người dùng từ Font Awesome
import { message } from "antd";
import "../assets/Navbar.css";
const Navbar = () => {
  // State để kiểm tra xem người dùng có đăng nhập hay không
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    // Kiểm tra user từ localStorage khi component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Xóa thông tin user và token từ localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("customerInfo");
    setUser(null);
    message.success("Đăng xuất thành công");
    navigate("/");
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img
            src={logo}
            alt="Logo Hệ Thống Đặt Vé Xe"
            className="navbar-logo"
          />
        </Link>
      </div>
      <ul className="navbar-nav">
        <li>
          <Link to="/">Trang chủ</Link>
        </li>
        <li>
          <Link to="/my-tickets">vé</Link>
        </li>
        {/* <li>
          <Link to="/schedule">Lịch Trình</Link>
        </li> */}
        {/* <li>
          <Link to="/invoices">Hóa Đơn</Link>
        </li> */}
        <li className="nav-user">
          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="dropbtn" onClick={toggleDropdown}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="user-avatar"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                )}
              </button>
              <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
                <div className="user-info-preview">
                  <span className="user-name">
                    {user.username || "Người dùng"}
                  </span>
                  {user.email && (
                    <span className="user-email">{user.email}</span>
                  )}
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                  Thông tin cá nhân
                </Link>
                <Link to="/my-tickets" onClick={() => setDropdownOpen(false)}>
                  Đơn đặt vé của tôi
                </Link>
                <div className="dropdown-divider"></div>
                <a href="#" onClick={handleLogout}>
                  Đăng xuất
                </a>
              </div>
            </div>
          ) : (
            <Link to="/login" className="auth-link">
              <FontAwesomeIcon icon={faUser} />
              <span>Đăng nhập/Đăng ký</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
