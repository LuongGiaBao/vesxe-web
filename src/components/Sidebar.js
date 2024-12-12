// src/components/Sidebar.js
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../assets/Sidebar.css";

const Sidebar = ({}) => {
  const navigate = useNavigate(); // Khai báo hook navigate
  const adminName = localStorage.getItem("adminName");
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [isReportsMenuOpen, setIsReportsMenuOpen] = useState(false);
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName"); // Xóa tên admin khi đăng xuất
    navigate("/admin/login");
  };
  const toggleReportsMenu = () => {
    setIsReportsMenuOpen(!isReportsMenuOpen);
  };
  useEffect(() => {
    // Nếu đang ở trong một route của "Thống kê", mở menu
    if (location.pathname.startsWith("/admin/reports")) {
      setIsReportsMenuOpen(true);
    }
  }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = sidebarRef.current.scrollTop;
      }
    };

    handleScroll();
  }, []);
  return (
    <div ref={sidebarRef} className="sidebar">
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

        {/* Quản lý người dùng */}
        <li>
          <NavLink to="/admin/users" activeClassName="active">
            Quản lý nhân viên
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/customers" activeClassName="active">
            Quản lý khách hàng
          </NavLink>
        </li>

        {/* Quản lý chuyến xe và các mục con */}
        <li>
          <NavLink to="/admin/trips" activeClassName="active">
            Quản lý chuyến xe
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/pickup-points" activeClassName="active">
            Quản lý Điểm Đón
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/drop-off-points" activeClassName="active">
            Quản lý Điểm Trả
          </NavLink>
        </li>

        {/* Thêm mục Quản lý Địa điểm */}
        <li>
          <NavLink to="/admin/locations" activeClassName="active">
            Quản lý Địa điểm
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/schedules" activeClassName="active">
            Quản lý lịch
          </NavLink>
        </li>

        {/* Quản lý vé */}
        {/* <li>
          <NavLink to="/admin/tickets" activeClassName="active">
            Quản lý vé
          </NavLink>
        </li> */}

        {/* Quản lý giá */}
        <li>
          <NavLink to="/admin/prices" activeClassName="active">
            Quản lý giá
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/buses" activeClassName="active">
            Quản lý Xe
          </NavLink>
        </li>

        {/* Quản lý khuyến mãi */}
        <li>
          <NavLink to="/admin/promotions" activeClassName="active">
            Quản lý khuyến mãi
          </NavLink>
        </li>

        {/* Thống kê & Báo cáo */}

        <li>
          <NavLink to="/admin/invoices" activeClassName="active">
            Quản lý hóa đơn
          </NavLink>
        </li>

        {/* Quản lý thanh toán */}
        {/* <li>
          <NavLink to="/admin/payments" activeClassName="active">
            Quản lý thanh toán
          </NavLink>
        </li> */}
        <li>
          <button className="submenu-toggle ml-4" onClick={toggleReportsMenu}>
            Thống kê
          </button>
          {isReportsMenuOpen && (
            <ul className="submenu pt-4">
              <li>
                <NavLink
                  to="/admin/reports/CustomerReports"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Khách hàng
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports/EmployeeReports"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Nhân viên
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports/PromotionReports"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Khuyến mãi
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Đăng xuất */}
      <button onClick={onLogout} className="logout-btn">
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
