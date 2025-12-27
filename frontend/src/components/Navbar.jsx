import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
        <ul className="nav-links">
            <li><a href="#" className="active">HOME</a></li>
            <li><a href="#">ACCOMMODATIONS</a></li>
            <li><a href="#">GALLERY</a></li>
            <li><a href="#">PROMOTIONS</a></li>
            <li><a href="#">ABOUT</a></li>
            <li><a href="#">CONTACT</a></li>
        </ul>
        <div className="search-box">
            <button><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
    </nav>
  );
}

export default Navbar;