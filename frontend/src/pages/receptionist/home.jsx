import React from 'react';
import { useNavigate } from 'react-router-dom';
import SharedHome from '../share-home'; // Import trang chủ chung từ thư mục cha

const ReceptionistHome = () => {
  const navigate = useNavigate();

  const handleBooking = () => {
    // Hành động của Tiếp tân: Hỗ trợ khách đặt phòng
    // Có thể chuyển hướng đến trang booking hoặc modal đặt phòng cho khách
    console.log("Receptionist: Hỗ trợ đặt phòng");
  };

  // Nút Book Now của tiếp tân (nếu muốn hành vi khác khách hàng thì sửa ở đây)
  const receptionistBtn = (
    <button className="book-now-btn" onClick={handleBooking}>
      BOOK NOW
    </button>
  );

  return (
    <SharedHome 
      role="receptionist"  // <--- QUAN TRỌNG: Dòng này sẽ kích hoạt nút "CREATE ACCOUNT" trên Navbar
      HeroBtn={receptionistBtn}
    />
  );
};

export default ReceptionistHome;