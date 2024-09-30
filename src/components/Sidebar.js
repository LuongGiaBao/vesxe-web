import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/Sidebar.css';

const Sidebar = ({ adminName, onLogout }) => {
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
        <li>
          <NavLink to="/admin/users" activeClassName="active">
            Quản lý người dùng
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/trips" activeClassName="active">
            Quản lý chuyến xe
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/invoices" activeClassName="active">
            Quản lý vé
          </NavLink>
        </li>
        {/* Thêm các mục quản lý khác tại đây */}
      </ul>
      <button onClick={onLogout} className="logout-btn">Đăng xuất</button> {/* Nút đăng xuất */}
    </div>
  );
};

export default Sidebar;
