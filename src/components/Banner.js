import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FetchProvinces, FetchTrips } from "../api/homepage";
import "../assets/style.css";

const Banner = () => {
  const [oneWay, setOneWay] = useState(true);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [departureOptions, setDepartureOptions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [typeDeparture, setTypeDeparture] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const fetchedProvinces = await FetchProvinces();
        setProvinces(fetchedProvinces);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleSearch = async () => {
    if (!departure || !destination || !date) {
      setError("Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày đi.");
      return;
    }

    if (departure === destination) {
      setError("Điểm đi và điểm đến không được trùng nhau.");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      // Gọi hàm FetchTrips với các bộ lọc đã chọn
      // Gọi hàm FetchTrips để lấy tất cả các chuyến xe
      const allTrips = await FetchTrips();

      const filteredTrips = allTrips.filter(
        (trip) =>
          trip.departure.id === parseInt(departure) &&
          trip.destination.id === parseInt(destination) &&
          trip.seatsLeft >= parseInt(tickets)
      );

      console.log("Filtered trips:", filteredTrips);
      if (filteredTrips.length === 0) {
        setError("Không tìm thấy chuyến xe phù hợp.");
        return;
      }
      // Tìm đối tượng departure và destination từ danh sách provinces
      const departureProvince = provinces.find(
        (prov) => prov.id === parseInt(departure)
      );
      const destinationProvince = provinces.find(
        (prov) => prov.id === parseInt(destination)
      );
      // Điều hướng đến trang kết quả tìm kiếm với các chuyến xe đã lọc
      navigate("/search-results", {
        state: {
          departure: departureProvince,
          destination: destinationProvince,
          date,
          returnDate,
          tickets,
          oneWay,
          trips: filteredTrips,
        },
      });
    } catch (error) {
      setError("Đã xảy ra lỗi khi tìm chuyến xe.");
    }
  };

  const handleTripTypeChange = (isOneWay) => {
    setOneWay(isOneWay);
    if (isOneWay) {
      setReturnDate(null); // Clear return date if it's a one-way trip
    }
  };

  const handleTicketsChange = (e) => {
    const value = Math.max(1, Math.min(10, Number(e.target.value)));
    setTickets(value);
  };

  return (
    <div className="banner">
      <div className="search-box">
       

        <div className="search-fields">
          {/* Departure Field */}
          <div className="field">
            <label>Điểm đi</label>
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            >
              <option value="">Chọn điểm đi</option>
              {provinces.map((province, index) => (
                <option key={index} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Field */}
          <div className="field">
            <label>Điểm đến</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Chọn điểm đến</option>
              {provinces.map((province, index) => (
                <option key={index} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Departure Date Picker */}
          <div className="field">
            <label>Ngày đi</label>
            <DatePicker
              selected={date}
              onChange={(selectedDate) => setDate(selectedDate)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()} // Only allow future dates
              className="date-picker"
            />
          </div>

          {/* Return Date Picker */}
          {!oneWay && (
            <div className="field">
              <label>Ngày về</label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                dateFormat="dd/MM/yyyy"
                minDate={date} // Return date must be after departure date
                className="date-picker"
              />
            </div>
          )}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Search Button */}
        <button className="search-button" onClick={handleSearch}>
          Tìm chuyến xe
        </button>
      </div>
    </div>
  );
};

export default Banner;






