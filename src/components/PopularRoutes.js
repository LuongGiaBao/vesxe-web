// src/components/PopularRoutes.js
import React from 'react';
import '../assets/PopularRoutes.css'; // Import the CSS file for styling
import tphcm from '../assets/image/view-landmark-asian-sky-reflection.jpg';
import dalat from '../assets/image/asian-woman-wearing-vietnam-culture-traditional-strawberry-garden-doi-ang-khang-chiang-mai-thailand.jpg';
import danang from '../assets/image/view-world-monument-celebrate-world-heritage-day.jpg';
const PopularRoutes = () => {
  const routes = [
    {
      title: 'Tp Hồ Chí Minh',
      image: tphcm,
      destinations: [
        { name: 'Đà Lạt', distance: '305km', duration: '8 giờ', date: '05/09/2024', price: '290.000đ' },
        { name: 'Cần Thơ', distance: '166km', duration: '3 giờ 12 phút', date: '05/09/2024', price: '165.000đ' },
        { name: 'Long Xuyên', distance: '203km', duration: '5 giờ', date: '05/09/2024', price: '190.000đ' },
      ],
    },
    {
      title: 'Đà Lạt',
      image: dalat,
      destinations: [
        { name: 'TP. Hồ Chí Minh', distance: '310km', duration: '8 giờ', date: '05/09/2024', price: '290.000đ' },
        { name: 'Đà Nẵng', distance: '757km', duration: '17 giờ', date: '05/09/2024', price: '410.000đ' },
        { name: 'Cần Thơ', distance: '457km', duration: '11 giờ', date: '05/09/2024', price: '435.000đ' },
      ],
    },
    {
      title: 'Đà Nẵng',
      image: danang,
      destinations: [
        { name: 'Đà Lạt', distance: '666km', duration: '17 giờ', date: '05/09/2024', price: '410.000đ' },
        { name: 'BX An Sương', distance: '966km', duration: '20 giờ', date: '05/09/2024', price: '410.000đ' },
        { name: 'Nha Trang', distance: '528km', duration: '9 giờ 25 phút', date: '05/09/2024', price: '300.000đ' },
      ],
    },
  ];

  return (
    <div className="popular-routes">
      <h2 style={{paddingBottom:25}}>Tuyến Phổ Biến</h2>
      <div className="routes-container">
        {routes.map((route, index) => (
          <div className="route-card" key={index}>
            <div className="route-image" style={{ backgroundImage: `url(${route.image})` }}>
              <div className="route-title">Tuyến xe từ {route.title}</div>
            </div>
            <ul className="route-destinations">
              {route.destinations.map((destination, idx) => (
                <li key={idx} className="destination-item">
                  <div className="destination-row">
                    <span className="destination-name">{destination.name}</span>
                    <span className="destination-price">{destination.price}</span>
                  </div>
                  <span className="destination-info">
                    {destination.distance} - {destination.duration} - {destination.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PopularRoutes;
