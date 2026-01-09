import React from 'react';
import { useNavigate } from 'react-router-dom';
import SharedHome from '../share-home';

const ReceptionistHome = () => {
  const navigate = useNavigate();

  const handleBooking = () => {
    // Hành động của Tiếp tân: Hỗ trợ khách đặt phòng
    // Có thể chuyển hướng đến trang booking hoặc modal đặt phòng cho khách
    console.log("Receptionist: Hỗ trợ đặt phòng");
    navigate('../booking');
  };

  // Nút Book Now của tiếp tân (nếu muốn hành vi khác khách hàng thì sửa ở đây)
  const receptionistBtn = (
    <button className="book-now-btn" onClick={handleBooking}>
      BOOK NOW
    </button>
  );

  return (
    <SharedHome 
      role="receptionist" 
      HeroBtn={receptionistBtn} // Truyền nút này xuống SharedHome
    />
  );
};

export default ReceptionistHome;