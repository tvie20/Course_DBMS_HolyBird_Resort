import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ activeSection, role }) => { 
  const location = useLocation();

  // Kiểm tra xem có đang ở trang chủ (Home) không để dùng tính năng cuộn trang
  const isHomePage = [
      '/', '/home', '/home/',
      '/customer', '/customer/',
      '/receptionist', '/receptionist/'
  ].includes(location.pathname);

  const getLinkClass = (section) => {
    return activeSection === section ? 'active' : '';
  };

  return (
    <nav className="navbar">
        <ul className="nav-links">
            {/* 1. Các Link điều hướng cơ bản */}
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
                // Nếu ở trang con (ví dụ trang Login/Booking), hiện nút quay về Home
                <li>
                  <Link to={role === 'receptionist' ? "/receptionist/" : "/home/"}>
                        HOME
                  </Link>
                </li>
            )}

            {/* 2. Nút CREATE ACCOUNT - Chỉ hiện khi role là receptionist */}
            {/* Logic: Kiểm tra role được truyền từ SharedHome */}
            {role === 'receptionist' && (
                <li>
                    {/* Dùng Link để chuyển trang không load lại */}
                    <Link to="/receptionist/create-account">
                        CREATE ACCOUNT
                    </Link>
                </li>
            )}
        </ul>

        <div className="search-box">
            <button><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
    </nav>
  );
}

export default Navbar;