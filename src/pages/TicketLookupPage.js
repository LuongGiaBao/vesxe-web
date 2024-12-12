// src/pages/TicketLookupPage.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/TicketLookupPage.css';

const TicketLookupPage = () => {
  const [phone, setPhone] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [error, setError] = useState('');

  const handleLookup = () => {
    if (!phone || !ticketCode) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    // Thực hiện tra cứu vé (ví dụ gọi API)
   
    setError(''); // Xóa lỗi khi tra cứu thành công
  };

  return (
    <div className="TicketLookupPage">
      <Navbar />
      <div className="lookup-container">
        <h2>TRA CỨU THÔNG TIN ĐẶT VÉ</h2>
        <input
          type="text"
          placeholder="Vui lòng nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="lookup-input"
        />
        <input
          type="text"
          placeholder="Vui lòng nhập mã vé"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
          className="lookup-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLookup} className="lookup-btn">Tra cứu</button>
      </div>
      <Footer />
    </div>
  );
};

export default TicketLookupPage;
