// src/admin/InvoiceManagement.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Giả lập API call để lấy danh sách vé
    const fetchInvoices = async () => {
      const invoiceData = [
        { id: 1, userId: 1, tripId: 1, amount: 150000, status: 'Đã thanh toán', bookedAt: '2024-09-28 12:00' },
        { id: 2, userId: 2, tripId: 2, amount: 200000, status: 'Chưa thanh toán', bookedAt: '2024-09-28 13:00' },
        // Thêm nhiều vé khác
      ];
      setInvoices(invoiceData);
    };
    fetchInvoices();
  }, []);

  return (
    <div className="invoice-management">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý vé</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Người dùng</th>
              <th>ID Chuyến xe</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày giờ đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.userId}</td>
                <td>{invoice.tripId}</td>
                <td>{invoice.amount} VND</td>
                <td>{invoice.status}</td>
                <td>{invoice.bookedAt}</td>
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

export default InvoiceManagement;
