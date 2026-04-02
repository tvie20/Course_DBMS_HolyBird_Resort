import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ activeSection, role }) => { 
  const location = useLocation();

  const isHomePage = [
      '/', 
      '/home', 
      '/home/',
      '/customer', 
      '/customer/',
      '/receptionist', 
      '/receptionist/'
  ].includes(location.pathname);

  const getLinkClass = (section) => {
    return activeSection === section ? 'active' : '';
  };

  return (
    <nav className="navbar">
        <ul className="nav-links">
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
                <li>
                  <Link to={role === 'receptionist' ? "/receptionist/" : "/home/"}>
                        HOME
                  </Link>
                </li>
            )}

            {role === 'receptionist' && (
                <>
                    <li>
                        <Link to="/receptionist/create-account">
                            CREATE ACCOUNT
                        </Link>
                    </li>
                    <li>
                        <Link to="/receptionist/review">
                            REVIEW BOOKING
                        </Link>
                    </li>
                    <li>
                        <Link to="/receptionist/manage-rooms">
                            MANAGE ROOMS
                        </Link>
                    </li>
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