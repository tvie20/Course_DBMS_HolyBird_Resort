import React from 'react';

// Import ảnh từ thư mục assets
import imgMain from '../assets/room-family-triple-shore-2.jpg';
import imgSub1 from '../assets/room-family-triple-shore-3.jpg';
import imgSub2 from '../assets/room-family-triple-shore-4.jpg';
import imgSub3 from '../assets/room-family-triple-shore-5.jpg';

const Accommodations = () => {
  return (
    // ID này dùng để Neo cho Navbar cuộn xuống
    <section id="accommodations" className="acc-section">
        
        {/* --- PHẦN TRÊN: CHỮ VÀ ẢNH LỚN --- */}
        <div className="acc-top-container">
            {/* Cột trái: Nội dung text */}
            <div className="acc-text-content">
                <h2 className="acc-title">ACCOMODATIONS</h2>
                <p className="acc-description">
                    Step into a sanctuary where timeless design meets five-star luxury. 
                    Our rooms and suites, ranging from intimate retreats for solo travelers 
                    to expansive two-bedroom family suites, are defined by rich dark timber, 
                    warm ambient lighting, and bespoke local artistry. Each meticulously 
                    crafted space offers supreme comfort and tranquility, promising a 
                    sophisticated escape with stunning views, ensuring every guest finds 
                    their perfect haven.
                </p>
            </div>

            {/* Cột phải: Ảnh lớn */}
            <div className="acc-main-image">
                <img src={imgMain} alt="Main Room View" />
            </div>
        </div>

        {/* --- PHẦN DƯỚI: 3 ẢNH NHỎ --- */}
        <div className="acc-gallery-grid">
            <img src={imgSub1} alt="Room Detail 1" />
            <img src={imgSub2} alt="Room Detail 2" />
            <img src={imgSub3} alt="Room Detail 3" />
        </div>

    </section>
  );
};

export default Accommodations;