import React from 'react';

// Import ảnh (Nhớ sửa đường dẫn nếu bạn để ảnh chỗ khác)
import img1 from '../assets/promotions-1.jpg';
import img2 from '../assets/promotions-2.jpg';
import img3 from '../assets/promotions-3.jpg';

const promotionsData = [
    { 
        id: 1, 
        title: "Early Bird Discount", 
        desc: "Plan ahead and save! Get 15% off when you book your cozy retreat 30 days in advance. Secure your peaceful escape now.",
        img: img1 
    },
    { 
        id: 2, 
        title: "Celebrate Your Story Bonus", 
        desc: "Celebrating a birthday or anniversary? Enjoy a complimentary cake/wine and room decor. Tell us your story!",
        img: img2 
    },
    { 
        id: 3, 
        title: "Book 3 Nights, Get 1 Night Free", 
        desc: "Extend your tranquility. Book 3 paid nights and receive the 4th night on us. More time to relax and recharge.",
        img: img3 
    },
];

const Promotions = () => {
  return (
    // ID="promotions" để cuộn trang
    <section id="promotions" className="promo-section">
        <h2 className="promo-main-title">PROMOTIONS</h2>
        
        <div className="promo-grid">
            {promotionsData.map((item) => (
                <div key={item.id} className="promo-card">
                    {/* Phần Ảnh ở trên */}
                    <div className="promo-img-container">
                        <img src={item.img} alt={item.title} />
                    </div>

                    {/* Phần Chữ có viền ở dưới */}
                    <div className="promo-content">
                        <h3 className="promo-title">{item.title}</h3>
                        <p className="promo-desc">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
};

export default Promotions;