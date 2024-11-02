// src/components/Sidebar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/Sidebar.css";

const Sidebar = ({}) => {
  const navigate = useNavigate(); // Khai báo hook navigate
  const adminName = localStorage.getItem("adminName");

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName"); // Xóa tên admin khi đăng xuất
    navigate("/admin/login");
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <div className="admin-info">
        <p>Xin chào, {adminName}</p> {/* Hiển thị tên admin */}
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/dashboard" activeClassName="active">
            Dashboard
          </NavLink>
        </li>

        {/* Quản lý người dùng */}
        <li>
          <NavLink to="/admin/users" activeClassName="active">
            Quản lý người dùng
          </NavLink>
        </li>

        {/* Quản lý chuyến xe và các mục con */}
        <li>
          <NavLink to="/admin/trips" activeClassName="active">
            Quản lý chuyến xe
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/pickup-points" activeClassName="active">
            Quản lý Điểm Đón
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/drop-off-points" activeClassName="active">
            Quản lý Điểm Trả
          </NavLink>
        </li>

        {/* Thêm mục Quản lý Địa điểm */}
        <li>
          <NavLink to="/admin/locations" activeClassName="active">
            Quản lý Địa điểm
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/schedules" activeClassName="active">
            Quản lý lịch
          </NavLink>
        </li>

        {/* Quản lý vé */}
        {/* <li>
          <NavLink to="/admin/tickets" activeClassName="active">
            Quản lý vé
          </NavLink>
        </li> */}

        {/* Quản lý giá */}
        <li>
          <NavLink to="/admin/prices" activeClassName="active">
            Quản lý giá
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/buses" activeClassName="active">
            Quản lý Xe
          </NavLink>
        </li>

        {/* Quản lý khuyến mãi */}
        <li>
          <NavLink to="/admin/promotions" activeClassName="active">
            Quản lý khuyến mãi
          </NavLink>
        </li>

        {/* Thống kê & Báo cáo */}

        <li>
          <NavLink to="/admin/invoices" activeClassName="active">
            Quản lý hóa đơn
          </NavLink>
        </li>

        {/* Quản lý thanh toán */}
        <li>
          <NavLink to="/admin/payments" activeClassName="active">
            Quản lý thanh toán
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/reports" activeClassName="active">
            Thống kê & Báo cáo
          </NavLink>
        </li>
      </ul>

      {/* Đăng xuất */}
      <button onClick={onLogout} className="logout-btn">
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
