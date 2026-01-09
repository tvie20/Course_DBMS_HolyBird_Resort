import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const ReviewBooking = () => {
  const navigate = useNavigate();

  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
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
      name: 'Coastal Twin View',
      rating: '4.8/5',
      tags: ['2 adults', 'Standard', '1 Double bed'],
      checkIn: 'Check-in 10 Jun 2020',
      checkOut: 'Check-out 12 Jun 2020',
      nights: 2,
      totalPrice: 320,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300&auto=format&fit=crop'
    }
  ]);

  // --- 2. STATE CHO CÁC MODAL ---
  const [showCancelModal, setShowCancelModal] = useState(false);   
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [selectedIdToCancel, setSelectedIdToCancel] = useState(null);

  // --- 3. LOGIC SEE MORE ---
  const handleSeeMore = () => {
    const moreRooms = [
        {
            id: bookings.length + 1,
            name: 'Ocean Suite Panorama',
            rating: '4.9/5',
            tags: ['2 adults', 'Luxury', '1 King bed'],
            checkIn: 'Check-in 15 Jul 2020',
            checkOut: 'Check-out 20 Jul 2020',
            nights: 5,
            totalPrice: 1250,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=300&auto=format&fit=crop'
        },
        {
            id: bookings.length + 2,
            name: 'Family Garden Villa',
            rating: '4.7/5',
            tags: ['4 adults', 'Villa', '2 Double beds'],
            checkIn: 'Check-in 01 Aug 2020',
            checkOut: 'Check-out 03 Aug 2020',
            nights: 2,
            totalPrice: 800,
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=300&auto=format&fit=crop'
        }
    ];
    setBookings([...bookings, ...moreRooms]);
  };

  // --- 4. LOGIC HỦY PHÒNG ---
  const initiateCancel = (id) => {
    setSelectedIdToCancel(id);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setBookings(bookings.filter(item => item.id !== selectedIdToCancel));
    setShowCancelModal(false);
    setShowSuccessModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedIdToCancel(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedIdToCancel(null);
  };

  return (
    <div className="review-page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .review-page-wrapper, button, h1, h2, h3, p, span, div {
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

        /* HEADER SECTION */
        .page-header-group { margin-bottom: 30px; }
        .back-icon-circle {
            width: 40px; height: 40px; background-color: #ccc;
            border-radius: 50%; display: flex; justify-content: center; align-items: center;
            color: white; font-size: 20px; margin-bottom: 15px; cursor: pointer; transition: 0.2s;
        }
        .back-icon-circle:hover { background-color: #999; }
        .review-title { font-size: 28px; font-weight: 700; color: #0B2341; margin-bottom: 5px; }
        .review-subtitle { font-size: 14px; color: #333; font-weight: 400; }

        /* BOOKING CARD */
        .booking-card {
            background: white; border-radius: 12px; padding: 15px;
            display: flex; gap: 20px; margin-bottom: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03); animation: fadeIn 0.5s;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .card-img-wrapper { position: relative; width: 280px; height: 180px; flex-shrink: 0; border-radius: 8px; overflow: hidden; }
        .card-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .rating-badge-overlay {
            position: absolute; top: 10px; left: 10px;
            background-color: #FDD835; color: #000;
            font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 4px;
        }

        .card-info-middle { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .card-room-name { font-size: 20px; font-weight: 600; color: #000; margin-bottom: 10px; }
        .tags-row { display: flex; gap: 10px; margin-bottom: 15px; }
        .info-tag { background-color: #F5F5F5; color: #333; font-size: 12px; font-weight: 500; padding: 5px 15px; border-radius: 20px; }
        .dates-row { display: flex; gap: 15px; margin-bottom: 15px; }
        .date-box { padding: 8px 15px; border-radius: 6px; font-size: 13px; font-weight: 500; }
        .date-checkin { background-color: #CCFFCC; color: #006400; }
        .date-checkout { background-color: #FFCCCC; color: #8B0000; }
        .card-links { font-size: 13px; color: #0B2341; font-weight: 500; }

        .card-action-right { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; min-width: 120px; }
        .price-group { text-align: right; }
        .night-total { font-size: 13px; color: #555; margin-bottom: 2px; }
        .total-price { font-size: 28px; font-weight: 700; color: #000; }

        .btn-cancel {
            background-color: #0B2341; color: white; border: none;
            padding: 10px 40px; border-radius: 25px; font-size: 14px; font-weight: 500;
            cursor: pointer; transition: background 0.2s;
        }
        .btn-cancel:hover { background-color: #163a66; }

        /* SEE MORE BUTTON */
        .see-more-container { text-align: center; margin-top: 30px; }
        .see-more-text {
            color: #0B2341; font-size: 15px; font-weight: 600; cursor: pointer;
            display: inline-flex; align-items: center; gap: 8px; transition: 0.2s;
        }
        .see-more-text:hover { transform: translateY(2px); }

        /* --- MODAL CHUNG --- */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex; justify-content: center; align-items: center;
            z-index: 9999; backdrop-filter: blur(3px);
        }

        /* 1. WARNING MODAL STYLE */
        .warning-modal {
            background: white; width: 400px; padding: 30px;
            border-radius: 16px; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: popIn 0.3s ease-out;
        }
        .wm-icon { font-size: 40px; color: #ffbb33; margin-bottom: 15px; } 
        .wm-title { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 10px; }
        .wm-desc { font-size: 14px; color: #555; margin-bottom: 25px; line-height: 1.5; }
        .wm-actions { display: flex; gap: 15px; justify-content: center; }
        .btn-wm-cancel {
            padding: 10px 25px; border-radius: 25px; border: 1px solid #ccc;
            background: white; color: #333; font-weight: 600; cursor: pointer;
        }
        .btn-wm-confirm {
            padding: 10px 25px; border-radius: 25px; border: none;
            background: #d32f2f; color: white; font-weight: 600; cursor: pointer;
        }

        /* 2. SUCCESS MODAL STYLE */
        .success-modal {
            background: white; width: 350px; padding: 30px;
            border-radius: 16px; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: popIn 0.3s ease-out;
        }
        .sm-icon {
            width: 60px; height: 60px; background-color: #00C851; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            margin: 0 auto 20px; color: white; font-size: 30px;
        }
        .sm-title { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 10px; }
        .sm-desc { font-size: 14px; color: #555; margin-bottom: 25px; }
        .btn-sm-ok {
            background-color: #0B2341; color: white; border: none;
            padding: 10px 40px; border-radius: 25px; font-weight: 600; cursor: pointer;
        }

        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 768px) {
            .booking-card { flex-direction: column; }
            .card-img-wrapper { width: 100%; height: 200px; }
            .card-action-right { flex-direction: row; align-items: center; margin-top: 10px; }
        }
      `}</style>

      {/* --- CẬP NHẬT: TRUYỀN ROLE="CUSTOMER" --- */}
      <Header isLoggedIn={true} useDarkTheme={true} role="customer" />

      <div className="review-container">
        
        <div className="page-header-group">
            <div className="back-icon-circle" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
            <h1 className="review-title">Review your items</h1>
            <p className="review-subtitle">Please carefully review the dates an destination of your stays to avoid last moment disappointments</p>
        </div>

        <div className="review-list">
            {bookings.map(item => (
                <div className="booking-card" key={item.id}>
                    <div className="card-img-wrapper">
                        <img src={item.image} alt="Room" />
                        <div className="rating-badge-overlay">{item.rating}</div>
                    </div>

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

                    <div className="card-action-right">
                        <div className="price-group">
                            <div className="night-total">{item.nights} nights total</div>
                            <div className="total-price">${item.totalPrice}</div>
                        </div>
                        
                        <button className="btn-cancel" onClick={() => initiateCancel(item.id)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="see-more-container">
            <div className="see-more-text" onClick={handleSeeMore}>
                See more <i className="fa-solid fa-chevron-down"></i>
            </div>
        </div>

      </div>

      {showCancelModal && (
        <div className="modal-overlay">
            <div className="warning-modal">
                <div className="wm-icon">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 className="wm-title">Are you sure?</h3>
                <p className="wm-desc">
                    Do you really want to cancel this booking? This process cannot be undone.
                </p>
                <div className="wm-actions">
                    <button className="btn-wm-cancel" onClick={closeCancelModal}>
                        No, Keep it
                    </button>
                    <button className="btn-wm-confirm" onClick={confirmCancel}>
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="success-modal">
                <div className="sm-icon">
                    <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="sm-title">Cancelled Successfully!</h3>
                <p className="sm-desc">Your booking has been cancelled.</p>
                <button className="btn-sm-ok" onClick={closeSuccessModal}>
                    OK
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ReviewBooking;