import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const ReceptionistReviewBooking = () => {
  const navigate = useNavigate();

  // State quản lý việc bật nút Payment tổng
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

  // Dữ liệu giả lập
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: 'Deluxe Twin Garden with Children Themed Room',
      rating: '4.5/5',
      tags: ['2 adults', 'VIP', '2 single beds'],
      checkIn: '4 May 2020',
      checkOut: '9 May 2020',
      nights: 3,
      totalPrice: 476,
      paidAmount: 0, 
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=300&auto=format&fit=crop',
      status: 'pending' // Ban đầu là pending
    },
    {
      id: 2,
      name: 'Coastal Solace Twin View',
      rating: '4.8/5',
      tags: ['2 adults', 'Standard', '1 Double bed'],
      checkIn: '4 May 2020',
      checkOut: '9 May 2020',
      nights: 3,
      totalPrice: 320,
      paidAmount: 0, 
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300&auto=format&fit=crop',
      status: 'pending' 
    }
  ]);

  // --- HANDLERS (Đơn giản hóa: Không dùng Modal nữa) ---
  
  // 1. Xử lý Check-in
  const handleCheckIn = (id) => {
    if (window.confirm("Confirm Check-in for this room?")) {
        setBookings(bookings.map(item => {
            if (item.id === id) {
                return { ...item, status: 'checked-in' };
            }
            return item;
        }));
    }
  };

  // 2. Xử lý Check-out
  const handleCheckOut = (id) => {
    if (window.confirm("Confirm Check-out for this room?")) {
        setBookings(bookings.map(item => {
            if (item.id === id) {
                return { ...item, status: 'checked-out' };
            }
            return item;
        }));
        
        // Kích hoạt nút Payment tổng để chuyển sang bước thanh toán
        setIsPaymentEnabled(true);
    }
  };

  // 3. Xử lý Cancel
  const handleCancel = (id) => {
    if(window.confirm("Are you sure you want to cancel this booking?")) {
        setBookings(bookings.filter(item => item.id !== id));
    }
  };

  // 4. Chuyển hướng trang Payment
  const handleGlobalPayment = () => {
      if (isPaymentEnabled) {
          // navigate('/receptionist/payment'); // Sau này sẽ dẫn tới trang hóa đơn
          alert("Navigate to Payment Page");
      }
  };

  return (
    <div className="review-page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .review-page-wrapper, button, input, h1, h2, h3, h4, p, span, div, label {
            font-family: 'Poppins', sans-serif;
        }

        .review-page-wrapper {
            background-color: #F5F5F0;
            min-height: 100vh;
            padding-bottom: 50px;
        }

        .review-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        /* HEADER */
        .page-header-group { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .back-icon-circle { width: 40px; height: 40px; background-color: #ccc; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 20px; margin-bottom: 15px; cursor: pointer; transition: 0.2s; }
        .back-icon-circle:hover { background-color: #999; }
        .review-title { font-size: 28px; font-weight: 700; color: #0B2341; margin-bottom: 5px; }
        .review-subtitle { font-size: 14px; color: #333; font-weight: 400; }

        /* Nút Payment Disabled */
        .btn-payment {
            border: none; padding: 12px 30px; border-radius: 25px;
            font-size: 16px; font-weight: 600; margin-top: 10px; transition: 0.3s;
        }
        .btn-payment.disabled { background-color: #d1d1d1; color: white; cursor: not-allowed; }
        
        /* Nút Payment Enabled (Màu xanh đậm) */
        .btn-payment.enabled { background-color: #0B2341; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(11, 35, 65, 0.3); }
        .btn-payment.enabled:hover { background-color: #163a66; transform: translateY(-2px); }

        /* BOOKING CARD */
        .booking-card { background: white; border-radius: 12px; padding: 15px; display: flex; gap: 20px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); transition: 0.3s; }
        
        .booking-card.status-checked-out { opacity: 0.8; background-color: #fafafa; } 

        .card-img-wrapper { position: relative; width: 280px; height: 180px; flex-shrink: 0; border-radius: 8px; overflow: hidden; }
        .card-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .rating-badge-overlay { position: absolute; top: 10px; left: 10px; background-color: #FDD835; color: #000; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 4px; }
        
        .card-info-middle { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .card-room-name { font-size: 20px; font-weight: 600; color: #000; margin-bottom: 10px; }
        
        .status-badge { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-left: 10px; }
        .st-pending { background: #fff3cd; color: #856404; }
        .st-checked-in { background: #d4edda; color: #155724; }
        .st-checked-out { background: #e2e3e5; color: #383d41; } 

        .tags-row { display: flex; gap: 10px; margin-bottom: 15px; }
        .info-tag { background-color: #F5F5F5; color: #333; font-size: 12px; font-weight: 500; padding: 5px 15px; border-radius: 20px; }
        .dates-row { display: flex; gap: 15px; margin-bottom: 15px; }
        .date-box { padding: 8px 15px; border-radius: 6px; font-size: 13px; font-weight: 500; }
        .date-checkin { background-color: #CCFFCC; color: #006400; }
        .date-checkout { background-color: #FFCCCC; color: #8B0000; }
        .card-links { font-size: 13px; color: #0B2341; font-weight: 500; }
        
        .card-action-right { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; min-width: 220px; }
        .price-group { text-align: right; }
        .total-price { font-size: 28px; font-weight: 700; color: #000; }
        .paid-info { font-size: 12px; color: #00C851; font-weight: 600; }
        .due-info { font-size: 12px; color: #ff4444; font-weight: 600; }

        /* BUTTONS */
        .action-buttons-row { display: flex; gap: 10px; width: 100%; justify-content: flex-end; }
        .btn-action { flex: 1; border: none; padding: 10px 0; border-radius: 25px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; text-align: center; min-width: 100px; }
        
        /* Check-in (Xanh lá) */
        .btn-checkin { background-color: #00C851; color: white; }
        .btn-checkin:hover { background-color: #00963d; }
        
        /* Check-out (Cũng màu xanh lá theo hình mẫu) hoặc Xanh dương tùy ý */
        .btn-checkout { background-color: #00C851; color: white; } 
        .btn-checkout:hover { background-color: #00963d; }
        
        /* Cancel (Xanh đen) */
        .btn-cancel { background-color: #0B2341; color: white; }
        .btn-cancel:hover { background-color: #163a66; }

        /* Label CHECKED OUT (Thay thế cho nút bấm) */
        .checked-out-label {
            background-color: #eee;
            color: #777;
            padding: 10px 0;
            width: 100%;
            text-align: center;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            border: 1px solid #ccc;
        }

        .see-more-text { text-align: center; margin-top: 30px; color: #0B2341; font-size: 14px; font-weight: 500; cursor: pointer; }
      `}</style>

      <Header isLoggedIn={true} useDarkTheme={true} role="receptionist" />

      <div className="review-container">
        
        <div className="page-header-group">
            <div className="header-left">
                <div className="back-icon-circle" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
                <h1 className="review-title">Receptionist Dashboard</h1>
                <p className="review-subtitle">Manage guest check-ins, check-outs and payments.</p>
            </div>
            
            {/* Nút Payment: Enable khi isPaymentEnabled = true */}
            <button 
                className={`btn-payment ${isPaymentEnabled ? 'enabled' : 'disabled'}`}
                onClick={handleGlobalPayment}
                disabled={!isPaymentEnabled}
            >
                Payment
            </button>
        </div>

        <div className="review-list">
            {bookings.map(item => (
                <div className={`booking-card status-${item.status}`} key={item.id}>
                    
                    <div className="card-img-wrapper">
                        <img src={item.image} alt="Room" />
                        <div className="rating-badge-overlay">{item.rating}</div>
                    </div>

                    <div className="card-info-middle">
                        <div>
                            <h3 className="card-room-name">
                                {item.name} 
                                {item.status === 'pending' && <span className="status-badge st-pending">Pending</span>}
                                {item.status === 'checked-in' && <span className="status-badge st-checked-in">Checked In</span>}
                                {item.status === 'checked-out' && <span className="status-badge st-checked-out">Checked Out</span>}
                            </h3>
                            <div className="tags-row">
                                {item.tags.map((tag, i) => (<span key={i} className="info-tag">{tag}</span>))}
                            </div>
                            <div className="dates-row">
                                <div className="date-box date-checkin">{item.checkIn}</div>
                                <div className="date-box date-checkout">{item.checkOut}</div>
                            </div>
                        </div>
                        <div className="card-links">View rules | Get directions | Call hotel</div>
                    </div>

                    <div className="card-action-right">
                        <div className="price-group">
                            <div className="night-total">{item.nights} nights total</div>
                            <div className="total-price">${item.totalPrice}</div>
                        </div>
                        
                        <div className="action-buttons-row">
                            {/* --- 1. PENDING: Hiện Check-in & Cancel --- */}
                            {item.status === 'pending' && (
                                <>
                                    <button className="btn-action btn-checkin" onClick={() => handleCheckIn(item.id)}>Check-in</button>
                                    <button className="btn-action btn-cancel" onClick={() => handleCancel(item.id)}>Cancel</button>
                                </>
                            )}

                            {/* --- 2. CHECKED-IN: Hiện Check-out duy nhất --- */}
                            {item.status === 'checked-in' && (
                                <>
                                    <button className="btn-action btn-checkout" onClick={() => handleCheckOut(item.id)}>Check-out</button>
                                </>
                            )}

                            {/* --- 3. CHECKED-OUT: Hiện nhãn (Label) --- */}
                            {item.status === 'checked-out' && (
                                <div className="checked-out-label">
                                    Checked Out
                                </div>
                            )}
                        </div>
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

export default ReceptionistReviewBooking;