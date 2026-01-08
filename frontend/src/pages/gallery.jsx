import React, { useState } from 'react';

import img1 from '../assets/room-coastal-solace-twin-1.jpg';
import img2 from '../assets/room-bayview-deluxe-1.jpg';
import img3 from '../assets/room-coastal-twin-view-1.jpg';
import img4 from '../assets/room-premier-ocean-suite-1.jpg';
import img5 from '../assets/room-family-triple-shore-1.jpg';
import img6 from '../assets/room-luxury-king-retreat-1.jpg';
import img7 from '../assets/room-7.jpg';
import img8 from '../assets/room-8.jpg';
import img9 from '../assets/room-9.jpg';
import img10 from '../assets/room-10.jpg';

const roomsData = [
    { id: 1, name: "Coastal Solace Twin", capacity: "2 adults", price: "$49", img: img1 },
    { id: 2, name: "Bayview Deluxe", capacity: "2 adults | 1 child", price: "$99", img: img2 },
    { id: 3, name: "Coastal Twin View", capacity: "2 adults | 1 child", price: "$79", img: img3 },
    { id: 4, name: "Premier Ocean Suite", capacity: "2 adults | 1 child", price: "$199", img: img4 },
    { id: 5, name: "Family Triple Shore", capacity: "3 adults", price: "$159", img: img5 },
    { id: 6, name: "Luxury King Retreat", capacity: "2 adults | 2 children", price: "$209", img: img6 },
    // --- 4 PHÒNG ẨN ---
    { id: 7, name: "Ocean Breeze Villa", capacity: "4 adults", price: "$259", img: img7 },
    { id: 8, name: "Sunset Garden Suite", capacity: "2 adults", price: "$129", img: img8 },
    { id: 9, name: "Royal Palm Bungalow", capacity: "2 adults | 2 children", price: "$299", img: img9 },
    { id: 10, name: "Skyline Penthouse", capacity: "5 adults", price: "$499", img: img10 },
];

const Gallery = () => {
    // State quản lý số lượng phòng hiện ra (mặc định 6)
    const [visibleCount, setVisibleCount] = useState(4);

    const handleSeeMore = () => {
        // Khi bấm nút thì hiện tất cả phòng
        setVisibleCount(roomsData.length); 
    };

    return (
        <section id="gallery" className="gallery-section">
            <h2 className="gallery-title">GALLERY</h2>
            
            <div className="gallery-grid">
                {roomsData.slice(0, visibleCount).map((room, index) => (
                    // Logic: index chẵn (cột trái) -> bình thường
                    //        index lẻ (cột phải) -> đảo ngược (row-reverse) bằng class 'reversed'
                    <div key={room.id} className={`room-card ${index % 2 !== 0 ? 'reversed' : ''}`}>
                        
                        <div className="room-img-wrapper">
                            <img src={room.img} alt={room.name} />
                        </div>
                        
                        <div className="room-info">
                            <span className="room-capacity">{room.capacity}</span>
                            <h3 className="room-name">{room.name}</h3>
                            <span className="room-price">from {room.price} a night</span>
                        </div>

                    </div>
                ))}
            </div>

            {/* Nút See More chỉ hiện khi chưa show hết */}
            {visibleCount < roomsData.length && (
                <div className="see-more-container" onClick={handleSeeMore}>
                    <span>See more</span>
                    <i className="fa-solid fa-angle-down"></i>
                </div>
            )}
        </section>
    );
};

export default Gallery;