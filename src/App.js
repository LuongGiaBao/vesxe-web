// src/App.js
import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import GuestHomePage from "./pages/GuestHomePage";
import AdminDashboard from "./admin/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import UserManagement from "./admin/UserManagement";
import OTPPage from "./pages/OTPPage";
import SearchResults from "./pages/SearchResults";
import SearchResultsPage from "./pages/SearchResultsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import SchedulePage from "./pages/SchedulePage";
import TicketLookupPage from "./pages/TicketLookupPage";
import TripManagement from "./admin/TripManagement";
import InvoiceManagement from "./admin/InvoiceManagement";
import PickupPointsManagement from "./admin/PickupPointManagement";
import DropOffPointsManagement from "./admin/DropOffPointsManagement";
import PriceManagement from "./admin/PriceManagement";
import ReportManagement from "./admin/ReportManagement";
import PaymentManagement from "./admin/PaymentManagement";
import PromotionManagement from "./admin/PromotionManagement";
import TicketsManagement from "./admin/TicketsManagement";
import LocationManagement from "./admin/LocationManagement";
import AdminLoginPage from "./admin/AdminLoginPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import PaymentPage from "./pages/PaymentPage";
import InvoicePage from "./pages/InvoicePage";
import MyTicketsPage from "./pages/MyTicketsPage";
import ScheduleManagement from "./admin/ScheduleManagement";
import BusManagement from "./admin/BusManagement";
import CustomerManagement from "./admin/CustomerManagement";
import CustomerReports from "./admin/Reports/CustomerReports";
import EmployeeReports from "./admin/Reports/EmployeeReports";
import PromotionReports from "./admin/Reports/PromotionReports";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // useEffect(() => {
  //   // Kiểm tra cổng hiện tại
  //   const port = window.location.port;

  //   if (port === "3001") {
  //     // Nếu là cổng 3001, chuyển đến trang admin
  //     navigate("/admin/dashboard");
  //   } else {
  //     // Nếu là cổng 3000, chuyển đến trang người dùng
  //     navigate("/");
  //   }
  // }, [navigate]);

  useEffect(() => {
    // Ngăn trình duyệt cuộn lên đầu khi route thay đổi
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.scrollTop = sidebar.scrollTop;
    }
  }, [location]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GuestHomePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route
          path="/search-results-page/:departureLocation/:arrivalLocation"
          element={<SearchResultsPage />}
        />

        <Route
          path="/search-results/:departureLocation/:arrivalLocation"
          element={<SearchResults />}
        />
        <Route path="/seat-selection" element={<SeatSelectionPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/trips" element={<TripManagement />} />
        <Route
          path="/admin/pickup-points"
          element={<PickupPointsManagement />}
        />
        <Route
          path="/admin/drop-off-points"
          element={<DropOffPointsManagement />}
        />
        <Route path="/admin/invoices" element={<InvoiceManagement />} />
        <Route path="/admin/prices" element={<PriceManagement />} />
        <Route path="/admin/reports" element={<ReportManagement />} />
        <Route path="/admin/payments" element={<PaymentManagement />} />
        <Route path="/admin/promotions" element={<PromotionManagement />} />
        <Route path="/admin/tickets" element={<TicketsManagement />} />
        <Route path="/admin/locations" element={<LocationManagement />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/invoices" element={<InvoicePage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/admin/schedules" element={<ScheduleManagement />} />
        <Route path="/admin/buses" element={<BusManagement />} />
        <Route path="/admin/customers" element={<CustomerManagement />} />
        <Route
          path="/admin/reports/CustomerReports"
          element={<CustomerReports />}
        />
        <Route
          path="/admin/reports/EmployeeReports"
          element={<EmployeeReports />}
        />
        <Route
          path="/admin/reports/PromotionReports"
          element={<PromotionReports />}
        />
      </Routes>
    </div>
  );
}

// Bọc App component trong Router để sử dụng useNavigate
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
