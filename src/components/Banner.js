import React, { useState, useEffect } from "react";
import { Select, DatePicker, Button, Form, message } from "antd";
import dayjs from "dayjs";
import { fetchAllLocations } from "../api/LocationApi";
import { fetchAllTrips } from "../api/TripApi";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiservices";

const { Option } = Select;

const TripSearchPage = () => {
  const [locations, setLocations] = useState([]); // Danh sách các địa điểm
  const [departureId, setDepartureId] = useState(""); // ID địa điểm khởi hành
  const [arrivalId, setArrivalId] = useState(""); // ID địa điểm đến
  const [date, setDate] = useState(null); // Ngày đi
  const [trips, setTrips] = useState([]); // Danh sách chuyến đi
  const [allTrips, setAllTrips] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadLocations(); // Gọi hàm để tải địa điểm
    fetchTrips();
  }, []);

  const loadLocations = async () => {
    try {
      const locationsData = await fetchAllLocations();
      setLocations(locationsData.data);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };
  const fetchTrips = async () => {
    try {
      const response = await fetchAllTrips();
      if (response && Array.isArray(response.data)) {
        setAllTrips(response.data); // Lưu vào state nếu có dữ liệu hợp lệ
      } else {
        console.error("Dữ liệu chuyến đi không hợp lệ:", response);
      }
    } catch (error) {
      console.error("Lỗi khi tải chuyến đi:", error);
    }
  };

  const onSearch = async () => {
    if (!departureId || !arrivalId || !date) {
      message.error("Vui lòng nhập đầy đủ điểm đi và điểm đến.");
      return;
    }
    if (departureId === arrivalId) {
      message.error("Điểm đi và điểm đến không được trùng nhau.");
      return;
    }

    try {
      const allTrips = await fetchAllTrips(); // Lấy tất cả các chuyến đi

      // Kiểm tra xem allTrips có phải là mảng hay không
      if (!Array.isArray(allTrips.data)) {
        throw new Error("Dữ liệu chuyến đi không phải là một mảng.");
      }

      // Lọc các chuyến đi dựa trên địa điểm
      const filteredTrips = allTrips.data.filter((trip) => {
        const tripDepartureLocationId =
          trip.attributes.departure_location_id.data.id;
        const tripArrivalLocationId =
          trip.attributes.arrival_location_id.data.id;
        const tripDate = dayjs(trip.attributes.departureTime).format(
          "YYYY-MM-DD"
        );

        return (
          String(tripDepartureLocationId) === String(departureId) &&
          String(tripArrivalLocationId) === String(arrivalId) &&
          tripDate === dayjs(date).format("YYYY-MM-DD")
        );
      });

      setTrips(filteredTrips); // Cập nhật danh sách chuyến đi

      if (filteredTrips.length > 0) {
        navigate(`/search-results/${departureId}/${arrivalId}`, {
          state: { trips: filteredTrips },
        }); // Chuyển đến SearchResult và truyền dữ liệu
      } else {
        message.info("Không tìm thấy chuyến xe nào phù hợp.");
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm chuyến xe.");
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="banner">
      <div className="search-box">
        <div className="search-fields">
          {/* Departure Field */}
          <div className="field">
            <label>Điểm đi</label>
            <select onChange={(e) => setDepartureId(e.target.value)}>
              <option value="">Chọn điểm đi</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.attributes.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Field */}
          <div className="field">
            <label>Điểm đến</label>
            <select onChange={(e) => setArrivalId(e.target.value)}>
              <option value="">Chọn điểm đến</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.attributes.name}
                </option>
              ))}
            </select>
          </div>

          {/* Departure Date Picker */}
          <div className="field">
            <label>Ngày đi</label>
            <input type="date" onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {/* Search Button */}
        <Button type="primary" className="search-button" onClick={onSearch}>
          Tìm chuyến xe
        </Button>
      </div>
    </div>
  );
};

export default TripSearchPage;
