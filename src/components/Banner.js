import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";
import { FetchData } from "../api/homepage";
const Banner = () => {
  const [oneWay, setOneWay] = useState(true);
  const [departure, setDeparture] = useState("TP. Hồ Chí Minh");
  const [destination, setDestination] = useState("Bà Rịa - Vũng Tàu");
  const [date, setDate] = useState(new Date("2024-09-05"));
  const [returnDate, setReturnDate] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [error, setError] = useState("");
  const [departureOptions, setDepartureOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);


  const fetchBusTickets = async () => {
    try {
      const response = await FetchData(); // Call your API to fetch bus tickets
      const busTickets = response; // Use the response directly

      // Check if busTickets is defined and is an array
      if (!busTickets || !Array.isArray(busTickets)) {
        throw new Error("BusTicket data is not an array or is undefined");
      }

      // Extract unique departure and destination points
      const departures = [
        ...new Set(busTickets.map((ticket) => ticket.diemdi)),
      ]; // Unique departure points

      const destinations = [
        ...new Set(busTickets.map((ticket) => ticket.diemden)),
      ]; // Unique destination points

      // Update state with unique options
      setDepartureOptions(departures); // Set unique departure options
      setDestinationOptions(destinations); // Set unique destination options
    } catch (error) {
      console.error("Error fetching bus ticket data:", error);
      setError("Không thể lấy danh sách vé xe");
    }
  };

  useEffect(() => {
    fetchBusTickets();
  }, []);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!departure || !destination || !date) {
      setError("Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày đi.");
      return;
    }
    setError("");

    navigate("/search-results", {
      state: {
        departure,
        destination,
        date,
        returnDate,
        tickets,
        oneWay,
      },
    });
  };

  const handleTripTypeChange = (isOneWay) => {
    setOneWay(isOneWay);
    if (isOneWay) {
      setReturnDate(null);
    }
  };

  const handleTicketsChange = (e) => {
    const value = Math.max(1, Math.min(10, Number(e.target.value)));
    setTickets(value);
  };

  return (
    <div className="banner">
      <div className="search-box">
        <div className="trip-type">
          <label>
            <input
              type="radio"
              checked={oneWay}
              onChange={() => handleTripTypeChange(true)}
            />
            Một chiều
          </label>

          <label>
            <input
              type="radio"
              checked={!oneWay}
              onChange={() => handleTripTypeChange(false)}
            />
            Khứ hồi
          </label>
        </div>

        <div className="search-fields">
          <div className="field">
            <label>Điểm đi</label>
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            >
              {departureOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Điểm đến</label>
            <select
              value={destination} // Correctly reference the destination state
              onChange={(e) => setDestination(e.target.value)} // Update destination state
            >
              {destinationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Ngày đi</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()} // Chỉ cho phép chọn ngày từ hôm nay
              className="date-picker"
            />
          </div>

          {!oneWay && (
            <div className="field">
              <label>Ngày về</label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                dateFormat="dd/MM/yyyy"
                minDate={date} // Ngày về phải sau ngày đi
                className="date-picker"
              />
            </div>
          )}

          <div className="field">
            <label>Số vé</label>
            <select value={tickets} onChange={handleTicketsChange}>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="search-button" onClick={handleSearch}>
          Tìm chuyến xe
        </button>
      </div>
    </div>
  );
};

export default Banner;
