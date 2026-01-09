import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const ReceptionistReviewBooking = () => {
  const navigate = useNavigate();

  // --- 1. STATE DỮ LIỆU ---
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
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
      status: 'pending'
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

  // --- 2. STATE QUẢN LÝ MODAL ---
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [modalConfig, setModalConfig] = useState({
    type: '', // 'checkin' | 'checkout' | 'cancel'
    id: null,
    title: '',
    desc: ''
  });

  // --- 3. LOGIC SEE MORE ---
  const handleSeeMore = () => {
    const moreRooms = [
        {
            id: bookings.length + 1,
            name: 'Ocean Suite Panorama',
            rating: '4.9/5',
            tags: ['2 adults', 'Luxury', '1 King bed'],
            checkIn: '15 Jul 2020',
            checkOut: '20 Jul 2020',
            nights: 5,
            totalPrice: 1250,
            paidAmount: 500,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=300&auto=format&fit=crop',
            status: 'checked-in' 
        },
        {
            id: bookings.length + 2,
            name: 'Family Garden Villa',
            rating: '4.7/5',
            tags: ['4 adults', 'Villa', '2 Double beds'],
            checkIn: '01 Aug 2020',
            checkOut: '03 Aug 2020',
            nights: 2,
            totalPrice: 800,
            paidAmount: 0,
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=300&auto=format&fit=crop',
            status: 'pending'
        }
    ];
    setBookings([...bookings, ...moreRooms]);
  };

  // --- 4. LOGIC HÀNH ĐỘNG (INITIATE) ---
  const initiateAction = (type, id) => {
      let title = "";
      let desc = "";

      if (type === 'checkin') {
          title = "Confirm Check-in?";
          desc = "Are you sure you want to Check-in for this room?";
      } else if (type === 'checkout') {
          title = "Confirm Check-out?";
          desc = "Are you sure you want to Check-out for this room? Payment will be enabled.";
      } else if (type === 'cancel') {
          title = "Cancel Booking?";
          desc = "Are you sure you want to cancel this booking? This cannot be undone.";
      }

      setModalConfig({ type, id, title, desc });
      setShowConfirmModal(true);
  };

  // --- 5. LOGIC THỰC THI (EXECUTE) ---
  const executeAction = () => {
      const { type, id } = modalConfig;

      if (type === 'checkin') {
          setBookings(bookings.map(item => item.id === id ? { ...item, status: 'checked-in' } : item));
          showSuccess("Check-in Successful!", "The guest has been checked in.");
      } 
      else if (type === 'checkout') {
          setBookings(bookings.map(item => item.id === id ? { ...item, status: 'checked-out' } : item));
          setIsPaymentEnabled(true);
          showSuccess("Check-out Successful!", "The guest has checked out. Payment enabled.");
      } 
      else if (type === 'cancel') {
          setBookings(bookings.filter(item => item.id !== id));
          showSuccess("Cancelled Successfully!", "The booking has been cancelled.");
      }

      setShowConfirmModal(false);
  };

  const showSuccess = (title, desc) => {
      setModalConfig(prev => ({ ...prev, title, desc })); 
      setShowSuccessModal(true);
  };

  const handleGlobalPayment = () => {
      if (isPaymentEnabled) {
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

        /* BUTTONS */
        .btn-payment {
            border: none; padding: 12px 30px; border-radius: 25px;
            font-size: 16px; font-weight: 600; margin-top: 10px; transition: 0.3s;
        }
        .btn-payment.disabled { background-color: #d1d1d1; color: white; cursor: not-allowed; }
        .btn-payment.enabled { background-color: #0B2341; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(11, 35, 65, 0.3); }
        .btn-payment.enabled:hover { background-color: #163a66; transform: translateY(-2px); }

        /* CARD STYLE */
        .booking-card { background: white; border-radius: 12px; padding: 15px; display: flex; gap: 20px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); transition: 0.3s; animation: fadeIn 0.5s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

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
        /* ĐÃ XÓA STYLE CHO PAID/DUE VÌ KHÔNG CẦN THIẾT NỮA */

        .action-buttons-row { display: flex; gap: 10px; width: 100%; justify-content: flex-end; }
        .btn-action { flex: 1; border: none; padding: 10px 0; border-radius: 25px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; text-align: center; min-width: 100px; }
        
        .btn-checkin { background-color: #00C851; color: white; }
        .btn-checkin:hover { background-color: #00963d; }
        .btn-checkout { background-color: #00C851; color: white; } 
        .btn-checkout:hover { background-color: #00963d; }
        .btn-cancel { background-color: #0B2341; color: white; }
        .btn-cancel:hover { background-color: #163a66; }

        .checked-out-label {
            background-color: #eee; color: #777; padding: 10px 0;
            width: 100%; text-align: center; border-radius: 25px;
            font-weight: 600; font-size: 14px; border: 1px solid #ccc;
        }

        .see-more-text { text-align: center; margin-top: 30px; color: #0B2341; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;}
        .see-more-text:hover { transform: translateY(2px); }

        /* --- MODAL STYLES --- */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;
            z-index: 9999; backdrop-filter: blur(3px);
        }

        /* CONFIRM MODAL */
        .confirm-modal {
            background: white; width: 400px; padding: 30px; border-radius: 16px; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: popIn 0.3s ease-out;
        }
        .cm-icon { font-size: 40px; margin-bottom: 15px; } 
        .cm-icon.cancel { color: #ffbb33; }
        .cm-icon.check { color: #0B2341; }

        .cm-title { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 10px; }
        .cm-desc { font-size: 14px; color: #555; margin-bottom: 25px; line-height: 1.5; }
        .cm-actions { display: flex; gap: 15px; justify-content: center; }
        
        .btn-cm-cancel {
            padding: 10px 25px; border-radius: 25px; border: 1px solid #ccc;
            background: white; color: #333; font-weight: 600; cursor: pointer;
        }
        .btn-cm-confirm {
            padding: 10px 25px; border-radius: 25px; border: none;
            background: #0B2341; color: white; font-weight: 600; cursor: pointer;
        }
        .btn-cm-confirm.delete { background: #d32f2f; }

        /* SUCCESS MODAL */
        .success-modal {
            background: white; width: 350px; padding: 30px; border-radius: 16px; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: popIn 0.3s ease-out;
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
                            {/* Đã xóa phần hiển thị Paid/Due */}
                        </div>
                        
                        <div className="action-buttons-row">
                            {item.status === 'pending' && (
                                <>
                                    <button className="btn-action btn-checkin" onClick={() => initiateAction('checkin', item.id)}>Check-in</button>
                                    <button className="btn-action btn-cancel" onClick={() => initiateAction('cancel', item.id)}>Cancel</button>
                                </>
                            )}

                            {item.status === 'checked-in' && (
                                <>
                                    <button className="btn-action btn-checkout" onClick={() => initiateAction('checkout', item.id)}>Check-out</button>
                                </>
                            )}

                            {item.status === 'checked-out' && (
                                <div className="checked-out-label">Checked Out</div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="see-more-text" onClick={handleSeeMore}>
            See more <i className="fa-solid fa-chevron-down"></i>
        </div>

      </div>

      {/* --- CONFIRM MODAL --- */}
      {showConfirmModal && (
        <div className="modal-overlay">
            <div className="confirm-modal">
                <div className={`cm-icon ${modalConfig.type === 'cancel' ? 'cancel' : 'check'}`}>
                    {modalConfig.type === 'cancel' ? <i className="fa-solid fa-triangle-exclamation"></i> : <i className="fa-regular fa-circle-question"></i>}
                </div>
                <h3 className="cm-title">{modalConfig.title}</h3>
                <p className="cm-desc">{modalConfig.desc}</p>
                <div className="cm-actions">
                    <button className="btn-cm-cancel" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </button>
                    <button 
                        className={`btn-cm-confirm ${modalConfig.type === 'cancel' ? 'delete' : ''}`} 
                        onClick={executeAction}
                    >
                        {modalConfig.type === 'cancel' ? 'Yes, Delete' : 'Yes, Confirm'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="success-modal">
                <div className="sm-icon">
                    <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="sm-title">{modalConfig.title}</h3>
                <p className="sm-desc">{modalConfig.desc}</p>
                <button className="btn-sm-ok" onClick={() => setShowSuccessModal(false)}>
                    OK
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionistReviewBooking;