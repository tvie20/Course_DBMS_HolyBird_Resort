import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ activeSection, role }) => { 
  const location = useLocation();

<<<<<<< HEAD
  const isHomePage = [
      '/', 
      '/home', 
      '/home/',
      '/customer', 
      '/customer/',
      '/receptionist', 
      '/receptionist/'
=======
  // Kiểm tra xem có đang ở trang chủ (Home) không để dùng tính năng cuộn trang
  const isHomePage = [
      '/', '/home', '/home/',
      '/customer', '/customer/',
      '/receptionist', '/receptionist/'
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
  ].includes(location.pathname);

  const getLinkClass = (section) => {
    return activeSection === section ? 'active' : '';
  };

  return (
    <nav className="navbar">
        <ul className="nav-links">
<<<<<<< HEAD
=======
            {/* 1. Các Link điều hướng cơ bản (Cuộn trang) */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
            {isHomePage ? (
                <>
                    <li><a href="#home" className={getLinkClass('home')}>HOME</a></li>
                    <li><a href="#accommodations" className={getLinkClass('accommodations')}>ACCOMMODATIONS</a></li>
                    <li><a href="#gallery" className={getLinkClass('gallery')}>GALLERY</a></li>
                    <li><a href="#promotions" className={getLinkClass('promotions')}>PROMOTIONS</a></li>
                    <li><a href="#about" className={getLinkClass('about')}>ABOUT</a></li>
                    <li><a href="#contact" className={getLinkClass('contact')}>CONTACT</a></li>
                </>
            ) : (
<<<<<<< HEAD
=======
                // Nếu ở trang con, hiện nút quay về Home
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
                <li>
                  <Link to={role === 'receptionist' ? "/receptionist/" : "/home/"}>
                        HOME
                  </Link>
                </li>
            )}

<<<<<<< HEAD
            {role === 'receptionist' && (
                <>
=======
            {/* 2. CÁC MENU RIÊNG CHO TIẾP TÂN (RECEPTIONIST) */}
            {role === 'receptionist' && (
                <>
                    {/* Mục Tạo tài khoản */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
                    <li>
                        <Link to="/receptionist/create-account">
                            CREATE ACCOUNT
                        </Link>
                    </li>
<<<<<<< HEAD
=======

                    {/* Mục Xem lại đặt phòng (MỚI THÊM) */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
                    <li>
                        <Link to="/receptionist/review">
                            REVIEW BOOKING
                        </Link>
                    </li>
<<<<<<< HEAD
                    <li>
                        <Link to="/receptionist/manage-rooms">
                            MANAGE ROOMS
                        </Link>
                    </li>
=======
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
                </>
            )}
        </ul>

        <div className="search-box">
            <button><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
    </nav>
  );
}

export default Navbar;