// src/components/FeaturedPromotions.js
import React from 'react';
import Slider from 'react-slick';
import '../assets/FeaturedPromotions.css'; // Ensure this CSS file exists and is correctly imported
import promotion from '../assets/image/promotional_image_bus_ticket_booking.png';
import promotion2 from '../assets/image/promotion2.webp';
import promotion3 from '../assets/image/promotion.webp';
const FeaturedPromotions = () => {
    const promotions = [
      {
        image: promotion,
      },
      {
        image: promotion2,
      },
      {
        image: promotion3,
      },
    ];
  
    return (
      <div className="featured-promotions">
        <h2>Khuyến Mãi Nổi Bật</h2>
        <div className="promotions-container">
          {promotions.map((promo, index) => (
            <div key={index} className="promo-card">
              <img src={promo.image} alt={`Promotion ${index + 1}`} className="promo-image" />
            </div>
          ))}
        </div>
      </div>
    );
  };
export default FeaturedPromotions;
