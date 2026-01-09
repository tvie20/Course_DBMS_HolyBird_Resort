import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate, Link } from 'react-router-dom';
import '../../App.css'; 

const ReviewBooking = () => {
  const navigate = useNavigate();

  // Dữ liệu giả lập (Mock Data) giống trong hình
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: 'Deluxe Twin Garden with Children Themed Room',
      rating: '4.5/5',
      tags: ['2 adults', 'VIP', '2 single beds'],
      checkIn: 'Check-in 4 May 2020',
      checkOut: 'Check-out 9 May 2020',
      nights: 3,
      totalPrice: 476,
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Deluxe Twin Garden with Children Themed Room',
      rating: '4.5/5',
      tags: ['2 adults', 'VIP', '2 single beds'],
      checkIn: 'Check-in 4 May 2020',
      checkOut: 'Check-out 9 May 2020',
      nights: 3,
      totalPrice: 476,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300&auto=format&fit=crop'
    }
  ]);

  const handleCancel = (id) => {
    if(window.confirm("Are you sure you want to cancel this booking?")) {
        setBookings(bookings.filter(item => item.id !== id));
    }
  };

  return (
    <div className="review-page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .review-page-wrapper, button, h1, h2, h3, p, span, div {
            font-family: 'Poppins', sans-serif;
        }

        .review-page-wrapper {
            background-color: #F5F5F0; /* Màu nền be nhạt */
            min-height: 100vh;
            padding-bottom: 50px;
        }

        .review-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        /* --- HEADER SECTION --- */
        .page-header-group {
            margin-bottom: 30px;
        }

        .back-icon-circle {
            width: 40px; height: 40px;
            background-color: #ccc; /* Màu xám của nút back */
            border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            color: white; font-size: 20px;
            margin-bottom: 15px; cursor: pointer;
            transition: 0.2s;
        }
        .back-icon-circle:hover { background-color: #999; }

        .review-title {
            font-size: 28px; font-weight: 700; color: #0B2341;
            margin-bottom: 5px;
        }

        .review-subtitle {
            font-size: 14px; color: #333; font-weight: 400;
        }

        /* --- BOOKING CARD --- */
        .booking-card {
            background: white;
            border-radius: 12px;
            padding: 15px;
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }

        /* 1. Ảnh bên trái */
        .card-img-wrapper {
            position: relative;
            width: 280px; height: 180px;
            flex-shrink: 0;
            border-radius: 8px; overflow: hidden;
        }
        .card-img-wrapper img {
            width: 100%; height: 100%; object-fit: cover;
        }
        
        /* Badge điểm số góc trái ảnh */
        .rating-badge-overlay {
            position: absolute; top: 10px; left: 10px;
            background-color: #FDD835; /* Vàng */
            color: #000;
            font-size: 12px; font-weight: 600;
            padding: 4px 8px; border-radius: 4px;
        }

        /* 2. Thông tin ở giữa */
        .card-info-middle {
            flex: 1;
            display: flex; flex-direction: column; justify-content: space-between;
        }

        .card-room-name {
            font-size: 20px; font-weight: 600; color: #000; margin-bottom: 10px;
        }

        .tags-row {
            display: flex; gap: 10px; margin-bottom: 15px;
        }
        .info-tag {
            background-color: #F5F5F5; /* Xám nhạt */
            color: #333;
            font-size: 12px; font-weight: 500;
            padding: 5px 15px; border-radius: 20px;
        }

        .dates-row {
            display: flex; gap: 15px; margin-bottom: 15px;
        }
        .date-box {
            padding: 8px 15px; border-radius: 6px;
            font-size: 13px; font-weight: 500;
        }
        .date-checkin {
            background-color: #CCFFCC; /* Xanh lá nhạt */
            color: #006400; /* Chữ xanh đậm */
        }
        .date-checkout {
            background-color: #FFCCCC; /* Hồng nhạt */
            color: #8B0000; /* Chữ đỏ đậm */
        }

        .card-links {
            font-size: 13px; color: #0B2341; font-weight: 500;
        }

        /* 3. Giá và Nút bên phải */
        .card-action-right {
            display: flex; flex-direction: column; 
            justify-content: space-between; /* Đẩy giá lên trên, nút xuống dưới */
            align-items: flex-end;
            min-width: 120px;
        }

        .price-group { text-align: right; }
        .night-total { font-size: 13px; color: #555; margin-bottom: 2px; }
        .total-price { font-size: 28px; font-weight: 700; color: #000; }

        .btn-cancel {
            background-color: #0B2341;
            color: white;
            border: none;
            padding: 10px 40px;
            border-radius: 25px; /* Bo tròn pill */
            font-size: 14px; font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-cancel:hover { background-color: #163a66; }

        /* See more text */
        .see-more-text {
            text-align: center; margin-top: 30px;
            color: #0B2341; font-size: 14px; font-weight: 500; cursor: pointer;
        }

        @media (max-width: 768px) {
            .booking-card { flex-direction: column; }
            .card-img-wrapper { width: 100%; height: 200px; }
            .card-action-right { flex-direction: row; align-items: center; margin-top: 10px; }
        }
      `}</style>

      <Header isLoggedIn={true} useDarkTheme={true} />

      <div className="review-container">
        
        {/* Header */}
        <div className="page-header-group">
            <div className="back-icon-circle" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
            <h1 className="review-title">Review your items</h1>
            <p className="review-subtitle">Please carefully review the dates an destination of your stays to avoid last moment disappointments</p>
        </div>

        {/* List Items */}
        <div className="review-list">
            {bookings.map(item => (
                <div className="booking-card" key={item.id}>
                    
                    {/* Left: Image */}
                    <div className="card-img-wrapper">
                        <img src={item.image} alt="Room" />
                        <div className="rating-badge-overlay">{item.rating}</div>
                    </div>

                    {/* Middle: Info */}
                    <div className="card-info-middle">
                        <div>
                            <h3 className="card-room-name">{item.name}</h3>
                            
                            <div className="tags-row">
                                {item.tags.map((tag, i) => (
                                    <span key={i} className="info-tag">{tag}</span>
                                ))}
                            </div>

                            <div className="dates-row">
                                <div className="date-box date-checkin">{item.checkIn}</div>
                                <div className="date-box date-checkout">{item.checkOut}</div>
                            </div>
                        </div>

                        <div className="card-links">
                            View rules | Get directions | Call hotel
                        </div>
                    </div>

                    {/* Right: Price & Action */}
                    <div className="card-action-right">
                        <div className="price-group">
                            <div className="night-total">{item.nights} nights total</div>
                            <div className="total-price">${item.totalPrice}</div>
                        </div>
                        
                        <button className="btn-cancel" onClick={() => handleCancel(item.id)}>
                            Cancel
                        </button>
                    </div>

                </div>
            ))}
        </div>

        <div className="see-more-text">
            See more <i className="fa-solid fa-chevron-down"></i>
        </div>

      </div>
    </div>
  );
};

export default ReviewBooking;