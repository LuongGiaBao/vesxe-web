
import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { fetchAllTrips } from "../api/TripApi";

const AdminTrip = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getTrips = async () => {
      try {
        const data = await fetchAllTrips(); // Gọi hàm fetchAllTrips
        setTrips(data.data); // Lưu dữ liệu chuyến đi vào state
      } catch (error) {
        setError("Không thể lấy danh sách chuyến đi");
      } finally {
        setLoading(false);
      }
    };

    getTrips();
  }, []);
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý Chuyến đi</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Điểm đi</th>
              <th>Điểm đến</th>
              <th>Khoảng cách</th>
              <th>Thời gian di chuyển</th>
              <th>Thời gian khởi hành</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>{trip.attributes.departureLocation}</td>
                <td>{trip.attributes.arrivalLocation}</td>
                <td>{trip.attributes.distance}</td>
                <td>{trip.attributes.travelTime}</td>
                <td>
                  {new Date(trip.attributes.departureTime).toLocaleString()}
                </td>
                <td>{trip.attributes.status}</td>
                <td>
                  <button>Chỉnh sửa</button>
                  <button>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrip;
