// src/admin/TripManagement.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const TripManagement = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Giả lập API call để lấy danh sách chuyến xe
    const fetchTrips = async () => {
      const tripData = [
        { id: 1, route: 'TP. HCM - Vũng Tàu', departureTime: '2024-09-30 08:00', type: 'Giường nằm', seats: 40, booked: 25 },
        { id: 2, route: 'Hà Nội - Hải Phòng', departureTime: '2024-09-30 14:00', type: 'Ghế ngồi', seats: 30, booked: 18 },
        // Thêm nhiều chuyến xe khác
      ];
      setTrips(tripData);
    };
    fetchTrips();
  }, []);

  return (
    <div className="trip-management">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý chuyến xe</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tuyến đường</th>
              <th>Thời gian khởi hành</th>
              <th>Loại xe</th>
              <th>Số ghế</th>
              <th>Đã đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>{trip.route}</td>
                <td>{trip.departureTime}</td>
                <td>{trip.type}</td>
                <td>{trip.seats}</td>
                <td>{trip.booked}</td>
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

export default TripManagement;
