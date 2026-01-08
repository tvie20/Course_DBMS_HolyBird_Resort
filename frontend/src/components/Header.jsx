import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/logo.jpg';
import logoDark from '../assets/logo-darktheme.jpg';

const Header = ({ isLoggedIn, useDarkTheme = false }) => {
  return (
    // Thêm class dark-theme nếu useDarkTheme = true
    <header className={`top-bar ${useDarkTheme ? 'dark-theme' : ''}`}>
        
      {/* --- PHẦN TRÁI (Email) --- */}
      <div className="top-bar-left">
         <div className="contact-item">
            <i className="fa-solid fa-envelope-open-text"></i>
            <div className="text-info email-info">
                <span>DROP US A EMAIL:</span>
                <a href="mailto:holybirdresort4@gmail.com">holybirdresort4@gmail.com</a>
            </div>
         </div>
      </div>

      {/* --- PHẦN GIỮA (Logo) --- */}
      {/* Logic: Nếu đang ở dark theme thì hiện logoDark, ngược lại hiện logoWhite */}
      <div className="top-bar-center">
          <Link to="/">
             <img 
                src={useDarkTheme ? logoDark : logoWhite} 
                alt="Holybird Resort Logo" 
                className="logo" 
             />
          </Link>
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

         {/* Avatar User */}
         {isLoggedIn && (
            <div className="user-avatar-container">
                 <i className="fa-solid fa-circle-user user-avatar"></i>
            </div>
         )}
      </div>
        
    </header>
  );
}

export default Header;