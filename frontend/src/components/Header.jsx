import React from 'react';

const Header = ({ isLoggedIn }) => {
  return (
    <header className="top-bar">
        
        {/* --- PHẦN TRÁI (Email) --- */}
        <div className="top-bar-left">
            <div className="contact-item">
                <i className="fa-solid fa-envelope-open-text"></i>
                <div className="text-info">
                    <span>DROP US A EMAIL:</span>
                    <a href="mailto:holybirdresort4@gmail.com">holybirdresort4@gmail.com</a>
                </div>
            </div>
        </div>

        {/* --- PHẦN GIỮA (Logo) --- */}
        <div className="top-bar-center">
            <img src="/logo.jpg" alt="Holybird Resort Logo" className="logo" />
        </div>

        {/* --- PHẦN PHẢI (Phone + Avatar) --- */}
        <div className="top-bar-right">
            <div className="contact-item">
                <div className="text-info">
                    <span>CALL US:</span>
                    <a href="tel:+84983868386">(+84) 983868386</a>
                </div>
                <i className="fa-solid fa-phone"></i>
            </div>

            {/* Khu vực dành riêng cho Avatar (Luôn chiếm chỗ) */}
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