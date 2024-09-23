// src/admin/UserManagement.js
import React from 'react';
import Sidebar from '../components/Sidebar';

const UserManagement = () => {
  return (
    <div className="user-management">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý người dùng</h1>
        <p>Danh sách người dùng và các chức năng quản lý.</p>
        {/* Thêm nội dung quản lý người dùng tại đây */}
      </div>
    </div>
  );
};

export default UserManagement;
