// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul className="sidebar-menu">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/users">Quản lý người dùng</Link></li>
        <li><Link to="/admin/trips">Quản lý chuyến xe</Link></li>
        <li><Link to="/admin/invoices">Quản lý hóa đơn</Link></li>
        {/* Thêm các mục quản lý khác tại đây */}
      </ul>
    </div>
  );
};

export default Sidebar;
