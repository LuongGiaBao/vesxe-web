// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GuestHomePage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route
            path="/search-results/:departure/:destination"
            element={<SearchResults />}
          />
          <Route path="/seat-selection" element={<SeatSelectionPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/search" element={<TicketLookupPage />} />
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

        </Routes>
      </div>
    </Router>
  );
}

export default App;
