import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchDataSchedule } from "../api/Schedule";
import { FetchTrips } from "../api/homepage";

const SearchResults = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        if (location.state && location.state.trips) {
          setTrips(location.state.trips);
        } else {
          const { data } = await FetchTrips();
          setTrips(data);
        }
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [location.state]);

  const navigate = useNavigate();

  const handleSelectTrip = (trip) => {
    navigate("/seat-selection", { state: { selectedTrip: trip } });
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching
  }
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };
  return (
    <div className="trip-results">
      {trips.length === 0 ? (
        <p>Không tìm thấy chuyến xe nào phù hợp.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip.id} className="trip">
            <div className="trip-time-info">
              <div className="departure-time">
                <h3>{formatTime(trip.departureTime)}</h3>
                <p>{trip.departureStation}</p>
              </div>
              <div className="duration">
                <p>
                  {Math.abs(
                    new Date(`1970-01-01T${trip.arrivalTime}`) -
                      new Date(`1970-01-01T${trip.departureTime}`)
                  ) / 36e5}{" "}
                  giờ
                </p>
                <span>(Asia/Ho Chi Minh)</span>
              </div>
              <div className="arrival-time">
                <h3>{formatTime(trip.arrivalTime)}</h3>
                <p>{trip.destinationStation}</p>
              </div>
            </div>

            <div className="trip-details">
              <p>
                Ghế • <span>{trip.seatsLeft} chỗ trống</span>
              </p>
              <p className="price">{trip.price.toLocaleString()} ₫</p>
            </div>

            <div className="trip-actions">
              <button onClick={() => handleSelectTrip(trip)}>
                Chọn chuyến
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
