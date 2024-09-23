import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchTripSeats } from '../api/fakeapi'; // API giả để lấy danh sách ghế
import '../assets/SeatSelectionPage.css'; // Import CSS

const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const { selectedTrip } = location.state || {}; // Nhận thông tin chuyến xe từ trang trước

  const [seats, setSeats] = useState([]); // Danh sách ghế
  const [selectedSeats, setSelectedSeats] = useState([]); // Ghế đang chọn
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  }); // Thông tin khách hàng

  // Gọi API để lấy danh sách ghế
  useEffect(() => {
    fetchTripSeats(selectedTrip.tripId)
      .then((data) => {
        setSeats(data.seats); // Lưu danh sách ghế vào state
        setLoading(false); // Tắt trạng thái tải
      })
      .catch((error) => {
        console.error('Error fetching seat data:', error);
        setLoading(false); // Tắt trạng thái tải khi gặp lỗi
      });
  }, [selectedTrip.tripId]);

  // Hàm xử lý quay lại trang trước
  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  // Hàm xử lý chọn và bỏ chọn ghế
  const handleSeatSelect = (seatNumber) => {
    const updatedSeats = seats.map((seat) =>
      seat.number === seatNumber
        ? { ...seat, status: seat.status === 'selected' ? 'available' : 'selected' } // Chuyển từ selected về available và ngược lại
        : seat
    );
    setSeats(updatedSeats);

    // Cập nhật danh sách ghế đang chọn
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter((s) => s !== seatNumber) // Nếu ghế đã chọn, bỏ chọn
        : [...prevSeats, seatNumber] // Nếu ghế chưa chọn, thêm vào danh sách chọn
    );
  };

  // Hàm xử lý thay đổi thông tin khách hàng
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const totalAmount = selectedSeats.length * selectedTrip.price; // Tổng số tiền dựa trên số ghế đã chọn

  if (loading) {
    return <p>Đang tải ghế...</p>;
  }

  return (
    <div className="seat-selection-page">
      <div className="header">
        <button className="back-button" onClick={handleBack}>Quay lại</button> {/* Nút Back */}
        <h2>Chọn ghế cho chuyến: {selectedTrip.departure} - {selectedTrip.destination}</h2>
        <p>{selectedTrip.departureTime}, {selectedTrip.departureDate}</p>
      </div>

      <div className="main-content">
        {/* Phần chọn ghế */}
        <div className="seat-selection">
          <h3>Chọn ghế</h3>
          <div className="seat-grid">
            {seats.map((seat) => (
              <div
                key={seat.number}
                className={`seat ${seat.status}`}
                onClick={() => seat.status !== 'sold' && handleSeatSelect(seat.number)} // Cho phép nhấn vào ghế trống hoặc đã chọn, trừ ghế đã bán
              >
                {seat.number < 10 ? `0${seat.number}` : seat.number}
              </div>
            ))}
          </div>

          {/* Hướng dẫn về trạng thái của ghế */}
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

        {/* Thông tin chuyến đi và khách hàng */}
        <div className="info-section">
          <div className="trip-info">
            <h3>Thông tin lượt đi</h3>
            <p><strong>Tuyến xe:</strong> {selectedTrip.departureStation} - {selectedTrip.destinationStation}</p>
            <p><strong>Thời gian xuất bến:</strong> {selectedTrip.departureTime}</p>
            <p><strong>Số ghế:</strong> {selectedSeats.length}</p>
            <p><strong>Tổng tiền lượt đi:</strong> {totalAmount.toLocaleString()} ₫</p>
          </div>

          {/* Thông tin khách hàng */}
          <div className="customer-info">
            <h3>Thông tin khách hàng</h3>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={customerInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={customerInfo.phone}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customerInfo.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Chi tiết giá */}
          <div className="total-price">
            <h3>Chi tiết giá</h3>
            <p>Giá vé lượt đi: {selectedTrip.price.toLocaleString()} ₫</p>
            <p>Tổng tiền: {totalAmount.toLocaleString()} ₫</p>
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="confirm-button">Xác nhận đặt vé</button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
