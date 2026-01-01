import React from 'react';
import logo from '../assets/logo.jpg';

const Header = ({ isLoggedIn }) => {
  return (
    <header className="top-bar">
        {/* TRÁI: Email */}
        <div className="top-bar-left">
            <div className="contact-item">
                <i className="fa-solid fa-envelope-open-text"></i>
                <div className="text-info email-info">
                    <span>DROP US A EMAIL:</span>
                    <a href="mailto:holybirdresort4@gmail.com">holybirdresort4@gmail.com</a>
                </div>
            </div>
        </div>

        {/* GIỮA: Logo */}
        <div className="top-bar-center">
            {/* Ảnh trong thư mục public gọi bằng / */}
            <img src={logo} alt="Holybird Resort Logo" className="logo" />
        </div>

        {/* PHẢI: Phone + Avatar */}
        <div className="top-bar-right">
            <div className="contact-item">
                <div className="text-info">
                    <span>CALL US:</span>
                    <a href="tel:+84983868386">(+84) 983868386</a>
                </div>
                <i className="fa-solid fa-phone"></i>
            </div>

            <div className="avatar-placeholder">
                {isLoggedIn && (
                    <i className="fa-solid fa-circle-user user-avatar"></i>
                )}
            </div>
        </div>
    </header>
  );
}

export default Header;