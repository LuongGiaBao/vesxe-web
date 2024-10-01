import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";
import { FetchData } from "../api/homepage";

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
  // Fetch bus ticket data
  // const fetchBusTickets = async () => {
  //   try {
  //     const response = await FetchData(); // Call your API to fetch bus tickets
  //     const busTickets = response.data;

  //     if (!busTickets || !Array.isArray(busTickets)) {
  //       throw new Error("Bus ticket data is not valid.");
  //     }

  //     // Extract unique departure and destination points
  //     const departures = [...new Set(busTickets.map((ticket) => ticket.name))];
  //     const destinations = [
  //       ...new Set(busTickets.map((ticket) => ticket.name)),
  //     ];
  //     setDepartureOptions(departures);
  //     setDestinationOptions(destinations);
  //   } catch (error) {
  //     console.error("Error fetching bus ticket data:", error);
  //     setError("Không thể lấy danh sách vé xe.");
  //   }
  // };

  // useEffect(() => {
  //   fetchBusTickets();
  // }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const fetchedProvinces = await FetchData();
        setProvinces(fetchedProvinces);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleSearch = () => {
    if (!departure || !destination || !date) {
      setError("Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày đi.");
      return;
    }

    setError(""); // Clear any previous errors
    const filteredTickets = tickets.filter(
      (ticket) => ticket.typeDeparture === typeDeparture
    );
    // Navigate to search results
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
          {/* Departure Field */}
          <div className="field">
            <label>Điểm đi</label>
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            >
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

          {/* Tickets Field */}
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

        {/* Display error message */}
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
