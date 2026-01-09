import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const BookingDetail = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ MODAL & DỮ LIỆU ---
  const [showModal, setShowModal] = useState(false);          
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  
  // State mới cho Popup Cảnh báo (Thay thế alert)
  const [alertModal, setAlertModal] = useState({ show: false, message: '' });

  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false); 

  // Danh sách thành viên có sẵn
  const availableMembers = [
    { id: 'KH01', name: 'Nguyễn Văn A', cccd: '080200010001', phone: '0778012341', dob: '10/12/2005', gender: 'Male' },
    { id: 'KH02', name: 'Nguyễn Văn B', cccd: '080200010002', phone: '0778012342', dob: '10/08/2005', gender: 'Male' },
    { id: 'KH03', name: 'Nguyễn Văn C', cccd: '080200010003', phone: '0778012343', dob: '23/08/2005', gender: 'Female' },
    { id: 'KH04', name: 'Nguyễn Văn D', cccd: '080200010004', phone: '0778012344', dob: '08/07/2005', gender: 'Female' },
    { id: 'KH05', name: 'Nguyễn Văn E', cccd: '080200010005', phone: '0778012345', dob: '08/12/2005', gender: 'Female' },
  ];

  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);

  // Dữ liệu phòng
  const roomData = {
    name: '203. Deluxe Twin Garden with Children Themed Room',
    desc: 'This spacious room features a luxurious two twin beds and a vibrant children themed room with decor. Overlooking lush gardens, it includes modern amenities, private balcony, and bathroom with a hand-carved bathtub with Rain shower. Perfect for family gateways, enjoy the kid’s club and tailored resort activities for all ages.',
    price: 79,
    rating: 8.6,
    reviews: 668,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=200&auto=format&fit=crop',
    ],
    amenities: [
      '55m x 55m', 'Garden view', 'Non-smoking', 'Bathrobes provided', 'Smoke detetors', 'Telephone', 'Bathroom amenities',
      'Bath', 'Shower', 'Soundproofed room', 'Dining setting', 'Shower over bath', 'Closets in room', 'Cable television',
      'Air conditioned', 'Slippers', 'TV', 'Cribs',
      'Seperate toilet area', 'Desk', 'Alarm clock', 'Hairdryer', 'Linen and Towels provided', 'Outdoor setting', 
      'Lift/Elevator access', 'Iron', 'Mini bar', 'Private bathroom', 'Complimentary fruit basket', 'Shampoo', 
      'Body soap', 'Balcony', 'Fire extinguishers', 'Room safe'
    ]
  };

  // --- LOGIC HANDLERS ---

  const handleBookClick = () => {
    setIsConfirmed(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCheckboxChange = (id) => {
    setTempSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddMembers = () => {
    const selectedObj = availableMembers.filter(m => tempSelectedIds.includes(m.id));
    setAddedMembers(selectedObj);
    setShowMemberDropdown(false);
  };

  // --- XỬ LÝ BOOKING VỚI CUSTOM POPUP ---
  const handleFinalBook = () => {
    // 1. Kiểm tra có thành viên chưa
    if (addedMembers.length === 0) {
        // Thay thế alert bằng Custom Modal
        setAlertModal({ 
            show: true, 
            message: "Please add at least one member to the guest list!" 
        });
        return;
    }

    // 2. Kiểm tra đã tick confirm chưa
    if (!isConfirmed) {
        // Thay thế alert bằng Custom Modal
        setAlertModal({ 
            show: true, 
            message: "Please confirm that the information provided is accurate!" 
        });
        return;
    }

    // Nếu thỏa mãn hết -> Thành công
    setShowModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate('/customer'); 
  };

  const closeAlertModal = () => {
      setAlertModal({ ...alertModal, show: false });
  };

  return (
    <div className="detail-page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .detail-page-wrapper, button, input, h1, h2, h3, h4, p, span, div, label {
            font-family: 'Poppins', sans-serif;
        }

        .detail-page-wrapper {
            background-color: #F5F5F0;
            min-height: 100vh;
            padding-bottom: 50px;
        }

        .detail-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
            display: flex;
            gap: 40px;
            align-items: flex-start;
        }

        /* --- STYLES CŨ (GALLERY & INFO) --- */
        .gallery-column { flex: 0 0 280px; display: flex; flex-direction: column; gap: 15px; }
        .gallery-img-item { width: 100%; height: 160px; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
        .gallery-img-item:hover { transform: scale(1.02); }
        .gallery-img-item img { width: 100%; height: 100%; object-fit: cover; }

        .info-column { flex: 1; }
        .room-title { font-size: 24px; font-weight: 500; color: #000; margin-bottom: 20px; line-height: 1.3; }
        .room-desc { font-size: 14px; color: #333; line-height: 1.6; margin-bottom: 30px; text-align: justify; }
        .divider-line { height: 2px; background-color: #000; width: 100%; margin-bottom: 30px; margin-top: 40px; }
        
        .amenities-grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 40px; row-gap: 15px; }
        .amenity-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #000; font-weight: 400; }
        .check-icon-circle { min-width: 20px; height: 20px; border: 1px solid #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
        .check-icon-circle i { font-size: 10px; color: #000; }

        .detail-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px; }
        .footer-left-note p { font-size: 13px; color: #888; margin-bottom: 5px; }
        .note-strong { color: #000; font-weight: 600; }
        .footer-icons { display: flex; gap: 20px; margin-top: 15px; color: #888; font-size: 13px; }
        .footer-icons i { margin-right: 5px; }
        .footer-right-action { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
        
        .rating-wrapper { display: flex; align-items: center; gap: 15px; margin-bottom: 5px; }
        .rating-text { text-align: right; }
        .rt-status { display: block; font-weight: 700; font-size: 16px; color: #000; }
        .rt-count { font-size: 12px; color: #888; }
        .star-badge-large { position: relative; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; }
        .star-badge-large i { font-size: 55px; color: #FFD700; }
        .star-score { position: absolute; font-size: 14px; font-weight: 700; color: #000; top: 52%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
        .final-price { font-size: 24px; font-weight: 700; color: #39618b; margin-top: 5px; }
        .btn-book-large { background-color: #0B2341; color: white; padding: 12px 60px; border-radius: 30px; border: none; font-size: 18px; font-weight: 600; cursor: pointer; transition: background 0.3s; margin-top: 10px; }
        .btn-book-large:hover { background-color: #163a66; }

        /* --- MODAL STYLES --- */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex; justify-content: center; align-items: center;
            z-index: 9999; backdrop-filter: blur(2px);
        }

        .booking-modal {
            background-color: #fcfcfc;
            width: 850px;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }

        .bm-heading {
            font-size: 20px; font-weight: 700; color: #000; margin-bottom: 20px;
        }

        /* GUEST DETAILS */
        .guest-details-section { margin-bottom: 40px; }
        .dropdown-wrapper { position: relative; display: inline-block; margin-bottom: 30px; }
        
        .btn-choose-members {
            background: white; border: 1px solid #ccc; border-radius: 8px;
            padding: 10px 20px; font-size: 15px; font-weight: 600; color: #000;
            cursor: pointer; display: flex; align-items: center; gap: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .members-dropdown-popup {
            position: absolute; top: 110%; left: 0;
            background: white; border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 20px; width: 320px; z-index: 100;
        }
        .members-dropdown-popup::before {
            content: ""; position: absolute; top: -10px; left: 30px;
            border-width: 0 10px 10px 10px; border-style: solid;
            border-color: transparent transparent white transparent;
        }

        .member-checkbox-item {
            display: flex; align-items: center; gap: 10px;
            margin-bottom: 12px; font-size: 14px; color: #333; cursor: pointer;
        }
        .member-checkbox-item input[type="checkbox"] {
            width: 18px; height: 18px; accent-color: #000; cursor: pointer;
        }

        .btn-add-member {
            background-color: #0B2341; color: white; border: none;
            padding: 8px 30px; border-radius: 20px; font-size: 14px; font-weight: 500;
            display: block; margin: 10px 0 0 auto; cursor: pointer;
        }

        /* TABLE */
        .table-header-row {
            display: flex; justify-content: space-between;
            padding: 10px 20px; background-color: white; border-radius: 10px;
            margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .table-header-item { font-size: 14px; font-weight: 700; color: #000; text-align: center; flex: 1; }

        .table-data-row {
            display: flex; justify-content: space-between;
            padding: 10px 20px; background-color: transparent;
            border-bottom: 1px solid #eee;
        }
        .table-data-item { font-size: 14px; color: #333; text-align: center; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }


        /* BOOKING DETAILS */
        .booking-details-section { margin-bottom: 30px; }
        
        .booking-pills-container {
            display: flex; gap: 20px; margin-top: 15px; flex-wrap: wrap;
        }

        .info-pill {
            background: white; border-radius: 15px;
            padding: 15px 10px;
            min-width: 120px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            flex: 1; 
        }

        .pill-main-text {
            font-size: 16px; font-weight: 700; color: #39618b; margin-bottom: 2px;
            display: flex; align-items: center; gap: 8px; justify-content: center;
        }
        .pill-sub-text { font-size: 12px; color: #555; }

        /* CONFIRM & ACTIONS */
        .confirm-checkbox-wrapper {
            display: flex; align-items: center; gap: 10px; margin-bottom: 30px;
        }
        .confirm-checkbox-wrapper input { width: 20px; height: 20px; accent-color: #000; cursor: pointer; }
        .confirm-text { font-size: 15px; color: #000; font-weight: 400; cursor: pointer; }

        .modal-actions {
            display: flex; justify-content: flex-end; gap: 20px;
        }
        .btn-modal-action {
            background-color: #0B2341; color: white;
            padding: 12px 50px; border-radius: 25px; border: none;
            font-size: 16px; font-weight: 600; cursor: pointer;
            transition: background 0.3s;
        }
        .btn-modal-action:hover { background-color: #163a66; }

        /* --- SUCCESS & ALERT POPUP STYLES --- */
        .success-box {
            background: white;
            padding: 40px;
            border-radius: 20px;
            width: 450px;
            text-align: center;
            box-shadow: 0 15px 40px rgba(0,0,0,0.2);
            animation: popIn 0.3s ease-out;
            position: relative;
            z-index: 10000; /* Nổi lên trên cùng */
        }
        @keyframes popIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .success-icon-large {
            width: 70px; height: 70px;
            background-color: #00C851; /* Xanh lá cho Success */
            border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            margin: 0 auto 25px;
            border: 5px solid #fff;
            box-shadow: 0 0 0 1px #eee;
        }
        .success-icon-large i { font-size: 35px; color: white; }

        /* Alert Icon (Vàng) */
        .alert-icon-large {
            width: 70px; height: 70px;
            background-color: #FFC107; /* Màu vàng cảnh báo */
            border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            margin: 0 auto 25px;
            border: 5px solid #fff;
            box-shadow: 0 0 0 1px #eee;
        }
        .alert-icon-large i { font-size: 35px; color: white; }

        .success-title { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 15px; }
        .success-desc { font-size: 15px; color: #555; margin-bottom: 30px; }

        .btn-success-ok {
            background-color: #0B2341; color: white;
            padding: 10px 50px; border-radius: 25px; border: none;
            font-size: 16px; font-weight: 600; cursor: pointer;
        }

        @media (max-width: 900px) {
            .detail-container { flex-direction: column; }
            .gallery-column { width: 100%; flex-direction: row; overflow-x: auto; }
            .booking-modal { width: 95%; padding: 20px; }
            .booking-pills-container { flex-direction: column; }
            .info-pill { width: 100%; flex-direction: row; justify-content: space-between; padding: 15px; }
            .modal-actions { flex-direction: column; }
            .btn-modal-action { width: 100%; }
        }
      `}</style>

      {/* --- SỬA HEADER: THÊM role="customer" để hiện menu --- */}
      <Header isLoggedIn={true} useDarkTheme={true} role="customer" />

      <div className="detail-container">
        
        {/* --- LEFT: GALLERY --- */}
        <div className="gallery-column">
            {roomData.images.map((imgUrl, index) => (
                <div className="gallery-img-item" key={index}>
                    <img src={imgUrl} alt={`Room detail ${index}`} />
                </div>
            ))}
        </div>

        {/* --- RIGHT: INFO --- */}
        <div className="info-column">
            
            <h1 className="room-title">{roomData.name}</h1>
            <p className="room-desc">{roomData.desc}</p>

            <div className="amenities-grid">
                {roomData.amenities.map((item, idx) => (
                    <div className="amenity-item" key={idx}>
                        <div className="check-icon-circle">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <div className="divider-line"></div>

            <div className="detail-footer">
                <div className="footer-left-note">
                    <p>1 night, 2 adults</p>
                    <p className="note-strong">Free cancelation | No payment needed</p>
                    <p>You cancel later, so lock in this great price today</p>
                    
                    <div className="footer-icons">
                        <span><i className="fa-regular fa-circle-check"></i> Free parking</span>
                        <span><i className="fa-solid fa-wifi"></i> Free internet</span>
                    </div>
                </div>

                <div className="footer-right-action">
                    <div className="rating-wrapper">
                        <div className="rating-text">
                            <span className="rt-status">Excellent</span>
                            <span className="rt-count">{roomData.reviews} reviews</span>
                        </div>
                        <div className="star-badge-large">
                            <i className="fa-solid fa-star"></i>
                            <span className="star-score">{roomData.rating}</span>
                        </div>
                    </div>

                    <div className="final-price">US ${roomData.price}</div>
                    
                    <button className="btn-book-large" onClick={handleBookClick}>
                        Book
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- BOOKING FORM MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
            <div className="booking-modal">
                
                {/* 1. Guest Details Section */}
                <div className="guest-details-section">
                    <h3 className="bm-heading">Guest Details</h3>
                    
                    <div className="dropdown-wrapper">
                        <button 
                            className="btn-choose-members" 
                            onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                        >
                            Choose members <i className="fa-solid fa-caret-down"></i>
                        </button>

                        {showMemberDropdown && (
                            <div className="members-dropdown-popup">
                                {availableMembers.map(member => (
                                    <label key={member.id} className="member-checkbox-item">
                                        <input 
                                            type="checkbox" 
                                            checked={tempSelectedIds.includes(member.id)}
                                            onChange={() => handleCheckboxChange(member.id)}
                                        />
                                        ({member.id}) {member.name}
                                    </label>
                                ))}
                                <button className="btn-add-member" onClick={handleAddMembers}>Done</button>
                            </div>
                        )}
                    </div>

                    {/* Table Header */}
                    <div className="table-header-row">
                        <span className="table-header-item">Id</span>
                        <span className="table-header-item">Name</span>
                        <span className="table-header-item">CCCD</span>
                        <span className="table-header-item">Phone</span>
                        <span className="table-header-item">Day of Birth</span>
                        <span className="table-header-item">Gender</span>
                    </div>

                    {/* Table Data */}
                    {addedMembers.map(member => (
                        <div className="table-data-row" key={member.id}>
                            <span className="table-data-item">{member.id}</span>
                            <span className="table-data-item">{member.name}</span>
                            <span className="table-data-item">{member.cccd}</span>
                            <span className="table-data-item">{member.phone}</span>
                            <span className="table-data-item">{member.dob}</span>
                            <span className="table-data-item">{member.gender}</span>
                        </div>
                    ))}
                </div>

                {/* 2. Booking Details Section */}
                <div className="booking-details-section">
                    <h3 className="bm-heading">Booking Details</h3>
                    
                    <div className="booking-pills-container">
                        <div className="info-pill">
                            <span className="pill-main-text">203</span>
                            <span className="pill-sub-text">Room</span>
                        </div>
                        <div className="info-pill">
                            <span className="pill-main-text">
                                Sun, 08 Jan <i className="fa-solid fa-caret-down" style={{fontSize:'12px', color:'black', marginLeft: '5px'}}></i>
                            </span>
                            <span className="pill-sub-text">Check-in</span>
                        </div>
                        <div className="info-pill">
                            <span className="pill-main-text">
                                Wed, 11 Jan <i className="fa-solid fa-caret-down" style={{fontSize:'12px', color:'black', marginLeft: '5px'}}></i>
                            </span>
                            <span className="pill-sub-text">Check-out</span>
                        </div>
                        <div className="info-pill">
                            <span className="pill-main-text">US ${roomData.price}</span>
                            <span className="pill-sub-text">Per night</span>
                        </div>
                    </div>
                </div>

                {/* 3. Confirm Checkbox */}
                <div className="confirm-checkbox-wrapper">
                    <input 
                        type="checkbox" 
                        id="confirm-check" 
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                    />
                    <label htmlFor="confirm-check" className="confirm-text">
                        I confirm that all the information I have provided is accurate.
                    </label>
                </div>

                {/* 4. Action Buttons */}
                <div className="modal-actions">
                    <button className="btn-modal-action" onClick={handleCloseModal}>Cancel</button>
                    <button className="btn-modal-action" onClick={handleFinalBook}>Book</button>
                </div>

            </div>
        </div>
      )}

      {/* --- CUSTOM WARNING MODAL (NEW REPLACEMENT FOR ALERT) --- */}
      {alertModal.show && (
        <div className="modal-overlay" style={{zIndex: 10001}}> {/* Z-index cao hơn để đè lên modal chính */}
            <div className="success-box">
                <div className="alert-icon-large">
                    <i className="fa-solid fa-exclamation"></i>
                </div>
                <h3 className="success-title">Notice</h3>
                <p className="success-desc">{alertModal.message}</p>
                <button className="btn-success-ok" onClick={closeAlertModal}>OK</button>
            </div>
        </div>
      )}

      {/* --- SUCCESS POPUP --- */}
      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="success-box">
                <div className="success-icon-large">
                    <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="success-title">Booking Successful!</h3>
                <p className="success-desc">Your room has been booked successfully.</p>
                <button className="btn-success-ok" onClick={handleSuccessOk}>OK</button>
            </div>
        </div>
      )}

    </div>
  );
};

export default BookingDetail;