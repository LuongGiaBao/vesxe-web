// src/components/Banner.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../assets/style.css';

const Banner = () => {
  const [oneWay, setOneWay] = useState(true);
  const [departure, setDeparture] = useState('TP. Hồ Chí Minh');
  const [destination, setDestination] = useState('Bà Rịa - Vũng Tàu');
  const [date, setDate] = useState(new Date('2024-09-5'));
  const [returnDate, setReturnDate] = useState(null); // Ban đầu để null nếu là một chiều
  const [tickets, setTickets] = useState(1);
  const [error, setError] = useState(''); // State lưu trữ lỗi

  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

  // Hàm xử lý khi nhấn nút tìm chuyến xe
  const handleSearch = () => {
    // Kiểm tra thông tin đầu vào trước khi điều hướng
    if (!departure || !destination || !date) {
      setError('Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày đi.');
      return;
    }

    // Reset lỗi khi hợp lệ
    setError('');

    // Điều hướng đến trang kết quả tìm kiếm và truyền state
    navigate('/search-results', {
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

  // Hàm xử lý thay đổi loại vé (một chiều/khứ hồi)
  const handleTripTypeChange = (isOneWay) => {
    setOneWay(isOneWay);
    if (isOneWay) {
      setReturnDate(null); // Xóa giá trị ngày về nếu là một chiều
    }
  };

  // Giới hạn số vé từ 1 đến 10
  const handleTicketsChange = (e) => {
    const value = Math.max(1, Math.min(10, Number(e.target.value))); // Giới hạn số vé từ 1 đến 10
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
            <input 
              type="text" 
              value={departure} 
              onChange={(e) => setDeparture(e.target.value)} 
              placeholder="Nhập điểm đi"
            />
          </div>
          <div className="field">
            <label>Điểm đến</label>
            <input 
              type="text" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              placeholder="Nhập điểm đến"
            />
          </div>
          <div className="field">
            <label>Ngày đi</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}  // Chỉ cho phép chọn ngày từ hôm nay
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
                minDate={date}  // Ngày về phải sau ngày đi
                className="date-picker"
              />
            </div>
          )}

          <div className="field">
            <label>Số vé</label>
            <select 
              value={tickets} 
              onChange={handleTicketsChange}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button className="search-button" onClick={handleSearch}>
          Tìm chuyến xe
        </button>
      </div>
    </div>
  );
}

export default Banner;
