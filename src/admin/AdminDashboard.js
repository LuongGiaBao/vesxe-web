// src/admin/AdminDashboard.js
import React from "react";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../assets/admin-style.css";

const dataBarChart = [
  { name: "Tháng 1", total: 4000 },
  { name: "Tháng 2", total: 3000 },
  { name: "Tháng 3", total: 2000 },
  { name: "Tháng 4", total: 2780 },
  { name: "Tháng 5", total: 1890 },
];

const dataPieChart = [
  { name: "Chuyến xe thành công", value: 400 },
  { name: "Chuyến xe thất bại", value: 100 },
];

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Dashboard</h1>
        <p>Chào mừng đến với bảng điều khiển quản lý.</p>

        <h2>Tổng Tiền Theo Tháng</h2>
        <BarChart width={600} height={300} data={dataBarChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>

        <h2>Thống Kê Chuyến Xe</h2>
        <PieChart width={500} height={400} >
          <Pie
            data={dataPieChart}
            cx={250} // Điều chỉnh vị trí ngang
            cy={250} // Điều chỉnh vị trí dọc
            labelLine={false}
            label={(entry) => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
           
          >
            {dataPieChart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? "#0088FE" : "#00C49F"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default AdminDashboard;
