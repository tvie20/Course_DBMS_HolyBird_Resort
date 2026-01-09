import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/logo.jpg';
import logoDark from '../assets/logo-darktheme.jpg';

const Header = ({ isLoggedIn, useDarkTheme = false }) => {
  // --- STATE QUẢN LÝ MENU AVATAR ---
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Xử lý sự kiện click ra ngoài thì đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={`top-bar ${useDarkTheme ? 'dark-theme' : ''}`}>
      
      {/* --- CSS NỘI BỘ CHO HEADER & DROPDOWN --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .top-bar { font-family: 'Poppins', sans-serif; }

        /* Wrapper cho Avatar để xử lý click */
        .user-avatar-wrapper {
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        /* Avatar Icon */
        .user-avatar {
            transition: transform 0.2s, color 0.2s;
        }
        .user-avatar:hover {
            transform: scale(1.1);
        }

        /* --- DROPDOWN MENU --- */
        .user-dropdown-menu {
            position: absolute;
            top: 120%; /* Cách avatar một chút */
            right: 0;
            width: 200px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 10px 0;
            z-index: 1000;
            animation: fadeInMenu 0.2s ease-out;
            border: 1px solid #eee;
        }

        /* Mũi tên nhỏ trỏ lên (Optional) */
        .user-dropdown-menu::before {
            content: "";
            position: absolute;
            top: -6px; right: 15px;
            width: 12px; height: 12px;
            background: white;
            transform: rotate(45deg);
            border-left: 1px solid #eee;
            border-top: 1px solid #eee;
        }

        @keyframes fadeInMenu {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Các item trong menu */
        .ud-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            text-decoration: none;
            color: #333;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        }

        .ud-item:hover {
            background-color: #f5f5f0;
            color: #0B2341;
        }

        .ud-item i {
            width: 20px; /* Cố định chiều rộng icon để thẳng hàng */
            text-align: center;
            color: #6ea5d9;
        }

        .ud-divider {
            height: 1px;
            background-color: #eee;
            margin: 5px 0;
        }

        .ud-item.logout {
            color: #e63946;
        }
        .ud-item.logout:hover {
            background-color: #fff0f1;
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
      <div className="top-bar-center">
          <Link to="/">
             <img 
                src={useDarkTheme ? logoDark : logoWhite} 
                alt="Holybird Resort Logo" 
                className="logo" 
             />
          </Link>
      </div>

      {/* --- PHẦN PHẢI (Phone + Avatar MENU) --- */}
      <div className="top-bar-right">
         <div className="contact-item">
            <div className="text-info">
                <span>CALL US:</span>
                <a href="tel:+84983868386">(+84) 983868386</a>
            </div>
            <i className="fa-solid fa-phone"></i>
         </div>

         {/* Avatar User Logic */}
         {isLoggedIn && (
            <div className="user-avatar-container" ref={menuRef}>
                 {/* Bỏ Link, dùng div wrapper để xử lý click toggle menu */}
                 <div 
                    className="user-avatar-wrapper" 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                 >
                    <i className="fa-solid fa-circle-user user-avatar"></i>
                    
                    {/* --- MENU THẢ XUỐNG --- */}
                    {showUserMenu && (
                        <div className="user-dropdown-menu">
                            {/* Option 1: Profile */}
                            <Link 
                                to="/customer/profile" 
                                className="ud-item"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <i className="fa-regular fa-id-card"></i> Profile
                            </Link>

                            {/* Option 2: Review Booking (MỚI) */}
                            <Link 
                                to="/customer/review" 
                                className="ud-item"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <i className="fa-solid fa-list-check"></i> Review Booking
                            </Link>

                            <div className="ud-divider"></div>

                            {/* Option 3: Logout (Thêm cho đầy đủ) */}
                            <Link 
                                to="/login" 
                                className="ud-item logout"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i> Logout
                            </Link>
                        </div>
                    )}
                 </div>
            </div>
         )}
      </div>
        
    </header>
  );
}

export default Header;