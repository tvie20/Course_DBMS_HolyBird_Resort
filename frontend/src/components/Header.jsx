import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/logo.jpg';
import logoDark from '../assets/logo-darktheme.jpg';

const Header = ({ isLoggedIn, useDarkTheme = false }) => {
  return (
    <header className={`top-bar ${useDarkTheme ? 'dark-theme' : ''}`}>
      
      {/* --- IMPORT FONT POPPINS (Nếu chưa có ở index.html) --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        /* Đảm bảo Header dùng font mới */
        .top-bar {
            font-family: 'Poppins', sans-serif;
        }

        /* Xóa gạch chân mặc định của Link bao quanh avatar */
        .avatar-link {
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }
      `}</style>

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
      {/* Click vào Logo thì về trang chủ */}
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
                 {/* Bấm vào avatar sẽ dẫn đến trang Hồ sơ khách hàng */}
                 <Link to="/customer/profile" className="avatar-link">
                    <i className="fa-solid fa-circle-user user-avatar"></i>
                 </Link>
            </div>
         )}
      </div>
        
    </header>
  );
}

export default Header;