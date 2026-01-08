import React from 'react';
//import { useNavigate } from 'react-router-dom';
import SharedHome from '../share-home';

const CustomerHome = () => {
  //const navigate = useNavigate();

  const handleBooking = () => {
    // Hành động của Customer: Chuyển đến trang đặt phòng Online
    alert("Customer: Đi đến trang Booking Online");
    // navigate('/booking');
  };

  // Tạo nút bấm riêng cho Customer
  const customerBtn = (
    <button className="book-now-btn" onClick={handleBooking}>
      BOOK NOW
    </button>
  );

  return (
    <SharedHome 
      role="customer" 
      HeroBtn={customerBtn} // Truyền nút này xuống SharedHome
    />
  );
};

export default CustomerHome;