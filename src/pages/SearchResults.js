import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ trips }) => {
  const navigate = useNavigate();

  const handleSelectTrip = (trip) => {
    // Điều hướng tới trang chọn ghế và truyền dữ liệu chuyến xe
    navigate('/seat-selection', { state: { selectedTrip: trip } });
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
                <h3>{trip.departureTime}</h3>
                <p>{trip.departureStation}</p>
              </div>
              <div className="duration">
                <p>{Math.abs(new Date(`1970-01-01T${trip.arrivalTime}`) - new Date(`1970-01-01T${trip.departureTime}`)) / 36e5} giờ</p>
                <span>(Asian/Ho Chi Minh)</span>
              </div>
              <div className="arrival-time">
                <h3>{trip.arrivalTime}</h3>
                <p>{trip.destinationStation}</p>
              </div>
            </div>

            <div className="trip-details">
              <p>Ghế • <span>{trip.seatsLeft} chỗ trống</span></p>
              <p className="price">{trip.price.toLocaleString()} ₫</p>
            </div>

            <div className="trip-actions">
              <button onClick={() => handleSelectTrip(trip)}>Chọn chuyến</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
