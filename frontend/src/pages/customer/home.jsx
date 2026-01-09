import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SharedHome from '../share-home';

const CustomerHome = () => {
  const navigate = useNavigate(); // Khởi tạo hook

  const handleBooking = () => {
    // Sửa lại: Chuyển hướng đến trang /booking
    navigate('/booking');
  };

  const customerBtn = (
    <button className="book-now-btn" onClick={handleBooking}>
      BOOK NOW
    </button>
  );

  return (
    <SharedHome 
      role="customer" 
      HeroBtn={customerBtn}
    />
  );
};

export default CustomerHome;