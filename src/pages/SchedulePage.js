// src/pages/SchedulePage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FetchScheduleData } from '../api/fakeapi';
import '../assets/SchedulePage.css';

const SchedulePage = () => {
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
  
    useEffect(() => {
      const fetchSchedules = async () => {
        const response = await FetchScheduleData();
        setSchedules(response);
        setFilteredSchedules(response);
      };
  
      fetchSchedules();
    }, []);
  
    const handleSearch = () => {
      const filtered = schedules.filter(schedule => 
        (departure ? schedule.diemdi.toLowerCase().includes(departure.toLowerCase()) : true) &&
        (destination ? schedule.diemden.toLowerCase().includes(destination.toLowerCase()) : true)
      );
      setFilteredSchedules(filtered);
    };
  
    const handleSwap = () => {
      const temp = departure;
      setDeparture(destination);
      setDestination(temp);
    };
  
    return (
      <div className="SchedulePage">
        <Navbar />
        <div className="schedule-container">
          <div className="search-box">
            <div className="input-group">
              <input
                type="text"
                placeholder="Nhập điểm đi"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="search-input"
              />
              <button onClick={handleSwap} className="swap-button">&#8646;</button>
              <input
                type="text"
                placeholder="Nhập điểm đến"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="search-input"
              />
            </div>
            <button onClick={handleSearch} className="search-btn">Tìm chuyến xe</button>
          </div>
  
          {/* Phần hiển thị kết quả */}
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Tuyến xe</th>
                <th>Loại xe</th>
                <th>Quãng đường</th>
                <th>Thời gian hành trình</th>
                <th>Giá vé</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((schedule, index) => (
                <tr key={index}>
                  <td>
                    <span className="route">
                      <strong>{schedule.diemdi}</strong> 
                      <span className="arrow"> ➤ </span>
                      {schedule.diemden}
                    </span>
                  </td>
                  <td>{schedule.loaixe || '---'}</td>
                  <td>{schedule.quangduong || '---'} km</td>
                  <td>{schedule.thoigiandukien || '---'}</td>
                  <td>{schedule.giave || '---'} VND</td>
                  <td>
                    <button className="find-route-btn">Tìm tuyến xe</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    );
  };export default SchedulePage;
