import React, { useState } from 'react'; // Nhớ import useState
import Header from './components/Header';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  // Tạo biến trạng thái: mặc định là false (chưa đăng nhập)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm xử lý khi bấm nút Login
  const handleLogin = () => {
    setIsLoggedIn(true); // Chuyển trạng thái sang đã đăng nhập
  };

  // Hàm xử lý khi bấm nút Book Now (ví dụ)
  const handleBookNow = () => {
    alert("Chuyển đến trang đặt phòng!");
  };

  return (
    <div className="App">
      <section className="hero-section">
        
        {/* Truyền trạng thái isLoggedIn vào Header để hiển thị Avatar */}
        <Header isLoggedIn={isLoggedIn} />

        <Navbar />

        <div className="hero-content">
            <h1 className="main-title">HOLYBIRD RESORT</h1>
            <h2 className="sub-title">YOUR UNFORGETTABLE GATEWAY</h2>
            
            {/* Kiểm tra: Nếu đã Login thì hiện nút BOOK NOW, chưa thì hiện LOG IN */}
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
  )
}

export default App;