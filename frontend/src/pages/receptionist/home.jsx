import React from 'react';
//import { useNavigate } from 'react-router-dom';
import SharedHome from '../share-home';

const ReceptionistHome = () => {
  //const navigate = useNavigate();

  const handleWalkIn = () => {
    // Hành động của Lễ tân: Chuyển đến trang Thuê tại chỗ (Walk-in)
    // Quy trình: Chọn phòng -> Nhập thông tin khách -> Check-in ngay
    alert("Receptionist: Đi đến trang Walk-in (Thuê & Check-in ngay)");
    // navigate('/receptionist/walk-in');
  };

  // Tạo nút bấm riêng cho Receptionist
  const receptionistBtn = (
    <button className="book-now-btn" onClick={handleWalkIn}>
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