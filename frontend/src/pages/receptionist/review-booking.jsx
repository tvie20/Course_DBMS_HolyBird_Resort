import React, { useState } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const ReceptionistReviewBooking = () => {
  const navigate = useNavigate();

  // --- 1. STATE DỮ LIỆU (Đã bổ sung tag số giường) ---
  const [groups, setGroups] = useState([
    {
      groupId: 'G01',
      repName: 'Nguyễn Văn A',
      repCCCD: '079200001234',
      rooms: [
        {
          id: 1,
          name: 'Deluxe Twin Garden',
          rating: '4.5/5',
          tags: ['2 adults', 'VIP', '2 single beds'], // Đã thêm tag giường
          checkIn: '4 May 2020',
          checkOut: '9 May 2020',
          nights: 3,
          totalPrice: 476,
          image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=300&auto=format&fit=crop',
          status: 'checked-out' 
        },
        {
          id: 2,
          name: 'Coastal Solace Twin',
          rating: '4.8/5',
          tags: ['2 adults', 'Standard', '1 Double bed'], // Đã thêm tag giường
          checkIn: '4 May 2020',
          checkOut: '9 May 2020',
          nights: 3,
          totalPrice: 320,
          image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300&auto=format&fit=crop',
          status: 'pending' 
        }
      ]
    },
    {
      groupId: 'G02',
      repName: 'Trần Thị B',
      repCCCD: '080300005678',
      rooms: [
        {
          id: 3,
          name: 'Family Garden Villa',
          rating: '4.9/5',
          tags: ['4 adults', 'Villa', '2 Double beds'], // Đã thêm tag giường
          checkIn: '10 Jun 2020',
          checkOut: '12 Jun 2020',
          nights: 2,
          totalPrice: 800,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=300&auto=format&fit=crop',
          status: 'checked-in'
        }
      ]
    }
  ]);

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [modalConfig, setModalConfig] = useState({
    type: '', // 'checkin' | 'checkout' | 'cancel'
    roomId: null,
    groupId: null,
    title: '',
    desc: ''
  });

  // --- 2. LOGIC TÌM KIẾM ---
  const filteredGroups = groups.filter(group => 
    group.repName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    group.repCCCD.includes(searchTerm)
  );

  // --- 3. LOGIC SEE MORE (Đã bổ sung tag số giường) ---
  const handleSeeMore = () => {
    const newGroups = [
        {
            groupId: `G-NEW-${groups.length + 1}`,
            repName: 'Lê Văn C',
            repCCCD: '091200009999',
            rooms: [
                {
                    id: Date.now(), 
                    name: 'Ocean Suite Panorama',
                    rating: '5.0/5',
                    tags: ['2 adults', 'Luxury', '1 King bed'], // Tag đầy đủ
                    checkIn: '15 Aug 2020',
                    checkOut: '20 Aug 2020',
                    nights: 5,
                    totalPrice: 1200,
                    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=300&auto=format&fit=crop',
                    status: 'pending'
                }
            ]
        },
        {
            groupId: `G-NEW-${groups.length + 2}`,
            repName: 'Phạm Thị D',
            repCCCD: '082300008888',
            rooms: [
                {
                    id: Date.now() + 1,
                    name: 'Standard Twin Room',
                    rating: '4.6/5',
                    tags: ['2 adults', 'Standard', '2 Single beds'], // Tag đầy đủ
                    checkIn: '20 Sep 2020',
                    checkOut: '22 Sep 2020',
                    nights: 2,
                    totalPrice: 200,
                    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=300&auto=format&fit=crop',
                    status: 'checked-in'
                }
            ]
        }
    ];

    setGroups([...groups, ...newGroups]);
  };

  // --- 4. KIỂM TRA TRẠNG THÁI GROUP ĐỂ BẬT PAYMENT ---
  const isGroupReadyForPayment = (groupRooms) => {
    return groupRooms.length > 0 && groupRooms.every(r => r.status === 'checked-out');
  };

  // --- 5. LOGIC HÀNH ĐỘNG (INITIATE) ---
  const initiateAction = (type, groupId, roomId) => {
      let title = "";
      let desc = "";

      if (type === 'checkin') {
          title = "Confirm Check-in?";
          desc = "Are you sure you want to Check-in for this room?";
      } else if (type === 'checkout') {
          title = "Confirm Check-out?";
          desc = "Are you sure you want to Check-out for this room?";
      } else if (type === 'cancel') {
          title = "Cancel Booking?";
          desc = "Are you sure you want to cancel this booking? This cannot be undone.";
      }

      setModalConfig({ type, groupId, roomId, title, desc });
      setShowConfirmModal(true);
  };

  // --- 6. LOGIC THỰC THI (EXECUTE) ---
  const executeAction = () => {
      const { type, groupId, roomId } = modalConfig;

      const newGroups = groups.map(group => {
        if (group.groupId !== groupId) return group;

        if (type === 'cancel') {
            return {
                ...group,
                rooms: group.rooms.filter(r => r.id !== roomId)
            };
        }

        return {
            ...group,
            rooms: group.rooms.map(room => {
                if (room.id !== roomId) return room;
                
                let newStatus = room.status;
                if (type === 'checkin') newStatus = 'checked-in';
                if (type === 'checkout') newStatus = 'checked-out';
                
                return { ...room, status: newStatus };
            })
        };
      });

      const cleanedGroups = newGroups.filter(g => g.rooms.length > 0);
      setGroups(cleanedGroups);
      
      let successTitle = "Successful!";
      let successDesc = "Action completed.";
      
      if (type === 'checkin') { successTitle = "Check-in Successful!"; successDesc = "The guest has been checked in."; }
      if (type === 'checkout') { successTitle = "Check-out Successful!"; successDesc = "The guest has checked out."; }
      if (type === 'cancel') { successTitle = "Cancelled Successfully!"; successDesc = "The booking has been cancelled."; }

      setShowConfirmModal(false);
      showSuccess(successTitle, successDesc);
  };

  const showSuccess = (title, desc) => {
      setModalConfig(prev => ({ ...prev, title, desc })); 
      setShowSuccessModal(true);
  };

  const handleGroupPayment = (group) => {
      if (isGroupReadyForPayment(group.rooms)) {
        // 1. Tính toán dữ liệu để gửi sang trang Payment
          const subtotal = group.rooms.reduce((acc, room) => acc + room.totalPrice, 0);
          const promotion = 50; // Giả lập giảm giá (hoặc logic tính toán thực tế)
          const tax = (subtotal - promotion) * 0.1; // 10% thuế
          const total = subtotal - promotion + tax;

          // 2. Map danh sách phòng sang format của Payment Item
          const paymentItems = group.rooms.map((room, index) => ({
              no: index + 1,
              desc: `${room.name} - Room ${room.id + 200}`, // Giả lập số phòng
              qty: 1, // Hoặc số đêm (room.nights) tùy nghiệp vụ
              price: room.totalPrice,
              amount: room.totalPrice
          }));

          // 3. Tạo object dữ liệu
          const paymentData = {
              id: `SP-${Math.floor(Math.random() * 1000000)}`, // Tạo mã hóa đơn ngẫu nhiên
              customerName: group.repName,
              guests: group.guestsCount || "4 adults, 2 children", // Lấy từ data hoặc mặc định
              checkIn: group.rooms[0]?.checkIn,
              checkOut: group.rooms[0]?.checkOut,
              processor: "Do Anh Khoa", // Tên nhân viên đang đăng nhập
              processTime: new Date().toLocaleString('en-GB', { hour12: false }), // Lấy giờ hiện tại
              items: paymentItems,
              subtotal: subtotal,
              promotion: -promotion,
              tax: parseFloat(tax.toFixed(2)),
              total: parseFloat(total.toFixed(2))
          };

          // 4. Chuyển hướng và gửi dữ liệu qua `state`
          navigate('/receptionist/payment', { state: paymentData });
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

        /* HEADER & SEARCH */
        .page-header-group { margin-bottom: 20px; }
        .back-icon-circle { width: 40px; height: 40px; background-color: #ccc; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 20px; margin-bottom: 15px; cursor: pointer; transition: 0.2s; }
        .back-icon-circle:hover { background-color: #999; }
        .review-title { font-size: 28px; font-weight: 700; color: #0B2341; margin-bottom: 5px; }
        .review-subtitle { font-size: 14px; color: #333; font-weight: 400; }

        .search-bar-wrapper {
            margin-top: 20px;
            display: flex;
            align-items: center;
            background: white;
            padding: 10px 20px;
            border-radius: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            max-width: 600px;
        }
        .search-input {
            border: none;
            outline: none;
            flex: 1;
            font-size: 15px;
            margin-left: 10px;
            color: #333;
        }
        .search-icon { color: #888; }

        /* GROUP SECTION */
        .group-section {
            background-color: #fff;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.03);
            border: 1px solid #eee;
            animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .group-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px dashed #eee;
        }
        .rep-info h3 { font-size: 18px; font-weight: 700; color: #0B2341; margin-bottom: 4px; }
        .rep-info span { font-size: 14px; color: #555; }
        .rep-info i { margin-right: 8px; color: #0B2341; }

        .btn-group-payment {
            padding: 10px 25px; border-radius: 25px; font-size: 14px; font-weight: 600; border: none; transition: 0.3s;
        }
        .btn-group-payment.disabled { background-color: #e0e0e0; color: #999; cursor:not-allowed; }
        .btn-group-payment.enabled { background-color: #0B2341; color: white; cursor: pointer; box-shadow: 0 4px 10px rgba(11, 35, 65, 0.2); }
        .btn-group-payment.enabled:hover { background-color: #163a66; transform: translateY(-2px); }

        /* ROOM CARD */
        .booking-card { 
            background: #F9F9F9; border-radius: 12px; padding: 15px; display: flex; gap: 20px; margin-bottom: 15px; 
            border: 1px solid #eee; transition: 0.3s; 
        }
        .booking-card.status-checked-out { opacity: 0.7; background-color: #f0f0f0; } 

        .card-img-wrapper { position: relative; width: 220px; height: 140px; flex-shrink: 0; border-radius: 8px; overflow: hidden; } 
        .card-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .rating-badge-overlay { position: absolute; top: 10px; left: 10px; background-color: #FDD835; color: #000; font-size: 11px; font-weight: 600; padding: 3px 6px; border-radius: 4px; }
        
        .card-info-middle { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .card-room-name { font-size: 18px; font-weight: 600; color: #000; margin-bottom: 5px; }
        
        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-left: 10px; }
        .st-pending { background: #fff3cd; color: #856404; }
        .st-checked-in { background: #d4edda; color: #155724; }
        .st-checked-out { background: #e2e3e5; color: #383d41; } 

        .tags-row { display: flex; gap: 8px; margin-bottom: 10px; }
        .info-tag { background-color: #fff; border: 1px solid #ddd; color: #555; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
        .dates-row { display: flex; gap: 10px; margin-bottom: 10px; }
        .date-box { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; }
        .date-checkin { background-color: #CCFFCC; color: #006400; }
        .date-checkout { background-color: #FFCCCC; color: #8B0000; }
        .card-links { font-size: 12px; color: #0B2341; font-weight: 500; }
        
        .card-action-right { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; min-width: 200px; }
        .price-group { text-align: right; }
        .total-price { font-size: 24px; font-weight: 700; color: #000; }

        .action-buttons-row { display: flex; gap: 8px; width: 100%; justify-content: flex-end; }
        .btn-action { flex: 1; border: none; padding: 8px 0; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; text-align: center; min-width: 90px; }
        .btn-checkin { background-color: #00C851; color: white; } .btn-checkin:hover { background-color: #00963d; }
        .btn-checkout { background-color: #00C851; color: white; } .btn-checkout:hover { background-color: #00963d; }
        .btn-cancel { background-color: #0B2341; color: white; } .btn-cancel:hover { background-color: #163a66; }
        .checked-out-label { background-color: #ccc; color: #666; padding: 8px 0; width: 100%; text-align: center; border-radius: 20px; font-weight: 600; font-size: 13px; }

        .see-more-text { text-align: center; margin-top: 20px; color: #0B2341; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; }
        .see-more-text:hover { transform: translateY(2px); }

        /* MODAL STYLES */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(3px); }
        .confirm-modal { background: white; width: 400px; padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: popIn 0.3s ease-out; }
        .cm-icon { font-size: 40px; margin-bottom: 15px; } .cm-icon.cancel { color: #ffbb33; } .cm-icon.check { color: #0B2341; }
        .cm-title { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 10px; }
        .cm-desc { font-size: 14px; color: #555; margin-bottom: 25px; line-height: 1.5; }
        .cm-actions { display: flex; gap: 15px; justify-content: center; }
        .btn-cm-cancel { padding: 10px 25px; border-radius: 25px; border: 1px solid #ccc; background: white; color: #333; font-weight: 600; cursor: pointer; }
        .btn-cm-confirm { padding: 10px 25px; border-radius: 25px; border: none; background: #0B2341; color: white; font-weight: 600; cursor: pointer; }
        .btn-cm-confirm.delete { background: #d32f2f; }
        .success-modal { background: white; width: 350px; padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: popIn 0.3s ease-out; }
        .sm-icon { width: 60px; height: 60px; background-color: #00C851; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 20px; color: white; font-size: 30px; }
        .sm-title { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 10px; }
        .sm-desc { font-size: 14px; color: #555; margin-bottom: 25px; }
        .btn-sm-ok { background-color: #0B2341; color: white; border: none; padding: 10px 40px; border-radius: 25px; font-weight: 600; cursor: pointer; }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 768px) {
            .booking-card { flex-direction: column; }
            .card-img-wrapper { width: 100%; height: 200px; }
            .card-action-right { flex-direction: row; align-items: center; margin-top: 10px; }
            .group-header { flex-direction: column; align-items: flex-start; gap: 10px; }
            .btn-group-payment { width: 100%; }
        }
      `}</style>

      <Header isLoggedIn={true} useDarkTheme={true} role="receptionist" />

      <div className="review-container">
        
        {/* HEADER & SEARCH */}
        <div className="page-header-group">
            <div className="header-left">
                <div className="back-icon-circle" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
                <h1 className="review-title">Booking Management</h1>
                <p className="review-subtitle">Manage guest check-ins, check-outs and payments by group.</p>
                
                {/* THANH TÌM KIẾM */}
                <div className="search-bar-wrapper">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search by Representative Name or CCCD..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* --- LIST GROUPS --- */}
        <div className="groups-list">
            {filteredGroups.length === 0 ? (
                <p style={{textAlign:'center', color:'#888', marginTop:'50px'}}>No groups found.</p>
            ) : (
                filteredGroups.map(group => {
                    const canPay = isGroupReadyForPayment(group.rooms);

                    return (
                        <div className="group-section" key={group.groupId}>
                            {/* GROUP HEADER */}
                            <div className="group-header">
                                <div className="rep-info">
                                    <h3><i className="fa-solid fa-user-tie"></i> {group.repName}</h3>
                                    <span><i className="fa-solid fa-id-card"></i> CCCD: {group.repCCCD}</span>
                                    <span style={{marginLeft:'15px', fontSize:'13px', color:'#888'}}>({group.rooms.length} Rooms)</span>
                                </div>
                                
                                {/* NÚT PAYMENT CỦA ĐOÀN */}
                                <button 
                                    className={`btn-group-payment ${canPay ? 'enabled' : 'disabled'}`}
                                    onClick={() => handleGroupPayment(group)}
                                    disabled={!canPay}
                                >
                                    Payment for Group
                                </button>
                            </div>

                            {/* LIST ROOMS */}
                            <div className="group-rooms">
                                {group.rooms.map(item => (
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
                                                    {/* TAGS ĐÃ ĐƯỢC CẬP NHẬT */}
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
                                                {item.status === 'pending' && (
                                                    <>
                                                        <button className="btn-action btn-checkin" onClick={() => initiateAction('checkin', group.groupId, item.id)}>Check-in</button>
                                                        <button className="btn-action btn-cancel" onClick={() => initiateAction('cancel', group.groupId, item.id)}>Cancel</button>
                                                    </>
                                                )}
                                                {item.status === 'checked-in' && (
                                                    <>
                                                        <button className="btn-action btn-checkout" onClick={() => initiateAction('checkout', group.groupId, item.id)}>Check-out</button>
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
                        </div>
                    );
                })
            )}
        </div>

        {/* Nút See More */}
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
                    <button className="btn-cm-cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                    <button className={`btn-cm-confirm ${modalConfig.type === 'cancel' ? 'delete' : ''}`} onClick={executeAction}>
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
                <div className="sm-icon"><i className="fa-solid fa-check"></i></div>
                <h3 className="sm-title">{modalConfig.title}</h3>
                <p className="sm-desc">{modalConfig.desc}</p>
                <button className="btn-sm-ok" onClick={() => setShowSuccessModal(false)}>OK</button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionistReviewBooking;