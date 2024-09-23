import React, { useState } from 'react';

const SeatSelection = ({ seats }) => {
  const [seatStatus, setSeatStatus] = useState(seats); // Trạng thái ban đầu của ghế

  // Hàm xử lý chọn và bỏ chọn ghế
  const handleSeatSelect = (seatNumber) => {
    const updatedSeats = seatStatus.map((seat) =>
      seat.number === seatNumber
        ? { ...seat, status: seat.status === 'selected' ? 'available' : 'selected' } // Chuyển từ selected về available và ngược lại
        : seat
    );
    setSeatStatus(updatedSeats); // Cập nhật lại trạng thái ghế
  };

  return (
    <div className="seat-selection-container">
      <h3>Chọn ghế</h3>

      {/* Hiển thị ghế */}
      <div className="seat-grid">
        {seatStatus.map((seat) => (
          <div
            key={seat.number}
            className={`seat ${seat.status}`}
            onClick={() => seat.status !== 'sold' && handleSeatSelect(seat.number)} // Chỉ chọn được ghế chưa bán
          >
            {seat.number < 10 ? `0${seat.number}` : seat.number}
          </div>
        ))}
      </div>

      {/* Hướng dẫn về trạng thái ghế */}
      <div className="seat-legend">
        <div className="legend-item">
          <span className="seat sold"></span> Đã bán
        </div>
        <div className="legend-item">
          <span className="seat available"></span> Còn trống
        </div>
        <div className="legend-item">
          <span className="seat selected"></span> Đang chọn
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
