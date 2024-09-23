// src/admin/AdminDashboard.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import '../assets/admin-style.css';
const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Dashboard</h1>
        <p>Chào mừng đến với bảng điều khiển quản lý.</p>
        {/* Thêm nội dung quản lý tổng quan tại đây */}
      </div>
    </div>
  );
};

export default AdminDashboard;
