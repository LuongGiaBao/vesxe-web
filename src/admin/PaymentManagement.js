import React from "react";
import Sidebar from "../components/Sidebar";

const PaymentManagement = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý thanh toán</h1>
      </div>
    </div>
  );
};

export default PaymentManagement;
