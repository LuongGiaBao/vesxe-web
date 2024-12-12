// src/pages/SearchResultsPage.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchResults from "../pages/SearchResults"; // Đảm bảo đường dẫn tới SearchResults
import { fetchTrips } from "../api/fakeapi"; // Import Fake API
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import "../assets/SearchResults.css"; // Import CSS

const SearchResultsPage = () => {
  // const [trips, setTrips] = useState([]); // Dữ liệu chuyến xe
  const [loading, setLoading] = useState(true); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi

  const location = useLocation();
  const [trips, setTrips] = useState(location.state?.trips || []);

  // Gọi Fake API để lấy dữ liệu các chuyến xe

  return (
    <div className="search-results-page">
      {/* Navbar ở trên cùng */}
      <Navbar />

      {/* Banner ở dưới Navbar */}
      <Banner />

      {/* Nội dung bộ lọc và kết quả tìm kiếm sẽ nằm ngang nhau */}
      <div className="search-content">
        {/* Bộ lọc nằm bên trái */}
        <div className="filters">
          <h4>Bộ lọc tìm kiếm</h4>
          <label>Giờ đi</label>
          <div className="filter-buttons">
            <button>Sáng sớm 00:00 - 06:00 (0)</button>
            <button>Buổi sáng 06:00 - 12:00 (1)</button>
            <button>Buổi chiều 12:00 - 18:00 (13)</button>
            <button>Buổi tối 18:00 - 24:00 (6)</button>
          </div>

          <label>Loại xe</label>
          <div className="filter-buttons">
            <button>Ghế</button>
            <button>Giường</button>
            <button>Limousine</button>
          </div>

          <label>Hạng ghế</label>
          <div className="filter-buttons">
            <button>Hàng đầu</button>
            <button>Hàng giữa</button>
            <button>Hàng cuối</button>
          </div>

          <label>Tầng</label>
          <div className="filter-buttons">
            <button>Tầng trên</button>
            <button>Tầng dưới</button>
          </div>
        </div>

        {/* Phần kết quả tìm kiếm nằm bên phải */}
        <SearchResults trips={trips} />
      </div>

      {/* Footer ở dưới cùng */}
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
