// src/admin/UserManagement.js
import React from 'react';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../assets/admin-style.css';
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Giả lập API call để lấy danh sách người dùng
    const fetchUsers = async () => {
      const userData = [
        { id: 1, name: 'Nguyen Van A', email: 'a@example.com', phone: '0123456789', status: 'Hoạt động' },
        { id: 2, name: 'Tran Thi B', email: 'b@example.com', phone: '0987654321', status: 'Bị khóa' },
        // Thêm nhiều người dùng khác
      ];
      setUsers(userData);
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-management">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý người dùng</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.status}</td>
                <td>
                  <button className="edit-btn">Chỉnh sửa</button>
                  <button className="delete-btn">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
