import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import '../App.css';

const Home = () => {
  // Quản lý trạng thái Login tại trang Home
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleBookNow = () => {
    alert("Chuyển đến trang Booking!");
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        
        {/* Header nhận trạng thái Login */}
        <Header isLoggedIn={isLoggedIn} />

        <Navbar />

        <div className="hero-content">
            <h1 className="main-title">HOLYBIRD RESORT</h1>
            <h2 className="sub-title">YOUR UNFORGETTABLE GATEWAY</h2>
            
            {/* Nút bấm thay đổi theo trạng thái */}
            {isLoggedIn ? (
                <button className="book-now-btn" onClick={handleBookNow}>
                    BOOK NOW
                </button>
            ) : (
                <button className="login-btn" onClick={handleLogin}>
                    LOG IN
                </button>
            )}
        </div>

      </section>
    </div>
  );
}

export default Home;