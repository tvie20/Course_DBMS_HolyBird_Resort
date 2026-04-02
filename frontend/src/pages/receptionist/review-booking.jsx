import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const ReceptionistReviewBooking = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [showCompModal, setShowCompModal] = useState(false);
  const [compData, setCompData] = useState({
      tenThietBi: '',
      soLuong: 1,
      tienBoiThuong: 0,
      maPhong: '',
      maGiaoDich: ''
  });

  const [modalConfig, setModalConfig] = useState({
    type: '', roomId: null, groupId: null, maPhong: '', maGiaoDich: '', maCTGD: '', title: '', desc: ''
  });

  const fetchBookings = async () => {
    try {
        if (!isProcessing) setLoading(true);
        const res = await fetch('http://localhost:3000/api/receptionist/bookings');
        const data = await res.json();
        if (data.success) {
            setGroups(data.data);
        }
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
    } finally {
        if (!isProcessing) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredGroups = groups.filter(group => 
    (group.repName && group.repName.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (group.repCCCD && group.repCCCD.includes(searchTerm))
  );

  const isGroupReadyForPayment = (groupRooms) => {
    return groupRooms.length > 0 && groupRooms.every(r => r.status === 'checked-out');
  };

  const initiateAction = (type, group, room) => {
      let title = "";
      let desc = "";

      if (type === 'checkin') {
          title = "Confirm Check-in?";
          desc = `Confirm Check-in for Room ${room.maPhong}?`;
      } else if (type === 'checkout') {
          title = "Confirm Check-out?";
          desc = `Confirm Check-out for Room ${room.maPhong}?`;
      } else if (type === 'cancel') {
          title = "Cancel Booking?";
          desc = `Cancel booking for Room ${room.maPhong}?`;
      }

      setModalConfig({ 
          type, groupId: group.groupId, roomId: room.id, 
          maPhong: room.maPhong, maGiaoDich: room.maGiaoDich, maCTGD: room.id, 
          title, desc 
      });
      setShowConfirmModal(true);
  };

  const executeAction = async () => {
      const { type, maPhong, maGiaoDich, maCTGD } = modalConfig;
      let apiUrl = '', payload = {};

      if (type === 'checkin') { apiUrl = 'http://localhost:3000/api/receptionist/check-in'; payload = { maPhong, maGiaoDich }; }
      else if (type === 'checkout') { apiUrl = 'http://localhost:3000/api/receptionist/check-out'; payload = { maPhong, maGiaoDich, maCTGD }; }
      else if (type === 'cancel') { apiUrl = 'http://localhost:3000/api/receptionist/cancel'; payload = { maPhong, maGiaoDich }; }

      setIsProcessing(true);
      try {
          const res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const data = await res.json();

          if (data.success) {
              await fetchBookings(); 
              setShowConfirmModal(false);
              showSuccess("Successful!", data.message);
          } else {
              alert("Error: " + data.message);
              setShowConfirmModal(false);
          }
      } catch {
          alert("Connection error");
          setShowConfirmModal(false);
      } finally {
          setIsProcessing(false);
      }
  };

  const openCompensationModal = (room) => {
      setCompData({
          tenThietBi: '', soLuong: 1, tienBoiThuong: 0, 
          maPhong: room.maPhong, maGiaoDich: room.maGiaoDich
      });
      setShowCompModal(true);
  };

  const submitCompensation = async () => {
      if (!compData.tenThietBi || compData.tienBoiThuong <= 0) {
          alert("Please enter valid Equipment Name and Amount.");
          return;
      }
      setIsProcessing(true);
      try {
          const res = await fetch('http://localhost:3000/api/receptionist/add-compensation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(compData)
          });
          const data = await res.json();
          if (data.success) {
              setShowCompModal(false);
              showSuccess("Saved!", "Compensation added successfully.");
          } else {
              alert("Error: " + data.message);
          }
      } catch {
          alert("Connection error");
      } finally {
          setIsProcessing(false);
      }
  };

  const showSuccess = (title, desc) => {
      setModalConfig(prev => ({ ...prev, title, desc })); 
      setShowSuccessModal(true);
  };

  const handleGroupPayment = (group) => {
      if (isGroupReadyForPayment(group.rooms)) {
          const subtotal = group.rooms.reduce((acc, room) => acc + room.totalPrice, 0);
          const tax = subtotal * 0.1; 
          const total = subtotal + tax;

          const paymentItems = group.rooms.map((room, index) => ({
              no: index + 1, desc: `${room.name} (${room.maPhong})`, qty: 1, price: room.totalPrice, amount: room.totalPrice
          }));

          const paymentData = {
              id: group.groupId, customerName: group.repName, guests: "Group Booking",
              checkIn: group.rooms[0]?.checkIn, checkOut: new Date().toISOString(),
              processor: "Receptionist", processTime: new Date().toLocaleString('en-GB'),
              items: paymentItems, subtotal: subtotal, promotion: 0, 
              tax: parseFloat(tax.toFixed(2)), total: parseFloat(total.toFixed(2))
          };
          navigate('/receptionist/payment', { state: paymentData });
      }
  };

  return (
    <div className="review-page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .review-page-wrapper, button, input, h1, h2, h3, h4, p, span, div, label { font-family: 'Poppins', sans-serif; }
        .review-page-wrapper { background-color: #F5F5F0; min-height: 100vh; padding-bottom: 50px; }
        .review-container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
        .page-header-group { margin-bottom: 20px; }
        .back-icon-circle { width: 40px; height: 40px; background-color: #ccc; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 20px; margin-bottom: 15px; cursor: pointer; transition: 0.2s; }
        .back-icon-circle:hover { background-color: #999; }
        .review-title { font-size: 28px; font-weight: 700; color: #0B2341; margin-bottom: 5px; }
        .search-bar-wrapper { margin-top: 20px; display: flex; align-items: center; background: white; padding: 10px 20px; border-radius: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 600px; }
        .search-input { border: none; outline: none; flex: 1; font-size: 15px; margin-left: 10px; color: #333; }
        
        .group-section { background-color: #fff; border-radius: 16px; padding: 20px; margin-bottom: 30px; box-shadow: 0 5px 20px rgba(0,0,0,0.03); border: 1px solid #eee; animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .group-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px dashed #eee; }
        .rep-info h3 { font-size: 18px; font-weight: 700; color: #0B2341; margin-bottom: 4px; }
        .rep-info span { font-size: 14px; color: #555; }
        .rep-info i { margin-right: 8px; color: #0B2341; }
        
        .btn-group-payment { padding: 10px 25px; border-radius: 25px; font-size: 14px; font-weight: 600; border: none; transition: 0.3s; }
        .btn-group-payment.disabled { background-color: #e0e0e0; color: #999; cursor:not-allowed; }
        .btn-group-payment.enabled { background-color: #0B2341; color: white; cursor: pointer; box-shadow: 0 4px 10px rgba(11, 35, 65, 0.2); }
        .btn-group-payment.enabled:hover { background-color: #163a66; transform: translateY(-2px); }
        .paid-badge { padding: 10px 25px; border-radius: 25px; font-size: 14px; font-weight: 700; background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; display: flex; align-items: center; gap: 8px; cursor: default; }

        .booking-card { background: #F9F9F9; border-radius: 12px; padding: 15px; display: flex; gap: 20px; margin-bottom: 15px; border: 1px solid #eee; transition: 0.3s; }
        .booking-card.status-checked-out { opacity: 0.7; background-color: #f0f0f0; } 
        .card-img-wrapper { width: 220px; height: 140px; flex-shrink: 0; border-radius: 8px; overflow: hidden; position: relative; } 
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
        .card-links { font-size: 12px; color: #0B2341; font-weight: 500; cursor: pointer; }
        
        .card-action-right { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; min-width: 200px; }
        .total-price { font-size: 24px; font-weight: 700; color: #000; }
        
        .action-buttons-row { display: flex; gap: 8px; width: 100%; justify-content: flex-end; flex-wrap: wrap; margin-top: 10px; }
        .btn-action { flex: 1; border: none; padding: 8px 5px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; text-align: center; min-width: 90px; }
        .btn-checkin { background-color: #00C851; color: white; }
        .btn-checkin:hover:not(:disabled) { background-color: #00963d; }
        .btn-checkout { background-color: #FF8800; color: white; }
        .btn-checkout:hover:not(:disabled) { background-color: #cc6d00; }
        .btn-cancel { background-color: #0B2341; color: white; }
        .btn-cancel:hover:not(:disabled) { background-color: #163a66; }
        .btn-compensate { background-color: #dc3545; color: white; }
        .btn-compensate:hover:not(:disabled) { background-color: #bb2d3b; }
        .btn-action:disabled { background-color: #e0e0e0; color: #999; cursor: not-allowed; opacity: 0.6; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(3px); }
        .confirm-modal, .success-modal, .comp-modal { background: white; width: 400px; padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: popIn 0.3s ease-out; }
        .comp-modal { text-align: left; width: 450px; }
        .cm-title, .comp-title, .sm-title { font-size: 20px; font-weight: 700; color: #0B2341; margin-bottom: 10px; }
        .comp-title { border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px; color: #0B2341; }
        .cm-desc, .sm-desc { font-size: 14px; color: #555; margin-bottom: 25px; line-height: 1.5; }
        
        .cm-actions { display: flex; gap: 15px; justify-content: center; } 
        .comp-actions { display: flex; gap: 15px; justify-content: flex-end; }

        .btn-cm-cancel, .btn-comp-cancel { padding: 10px 25px; border-radius: 25px; border: 1px solid #ccc; background: white; color: #333; font-weight: 600; cursor: pointer; }
        .btn-cm-confirm, .btn-comp-save { padding: 10px 25px; border-radius: 25px; border: none; background: #0B2341; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 140px;}
        .btn-cm-confirm.delete { background: #d32f2f; }
        .btn-cm-confirm:disabled, .btn-cm-cancel:disabled, .btn-comp-save:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .sm-icon { width: 60px; height: 60px; background-color: #00C851; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 20px; color: white; font-size: 30px; }
        .btn-sm-ok { background-color: #0B2341; color: white; border: none; padding: 10px 40px; border-radius: 25px; font-weight: 600; cursor: pointer; }
        .form-group { margin-bottom: 15px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px; color: #333; }
        .form-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; outline: none; font-family: 'Poppins'; }
        
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @media (max-width: 768px) { .booking-card { flex-direction: column; } .card-img-wrapper { width: 100%; height: 200px; } .card-action-right { flex-direction: row; align-items: center; margin-top: 10px; } .group-header { flex-direction: column; align-items: flex-start; gap: 10px; } .btn-group-payment { width: 100%; } }
      `}</style>

      <Header isLoggedIn={true} useDarkTheme={true} role="receptionist" />

      <div className="review-container">
        <div className="page-header-group">
            <div className="header-left">
                <div className="back-icon-circle" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
                <h1 className="review-title">Booking Management</h1>
                <p className="review-subtitle">Manage guest check-ins, check-outs and payments by group.</p>
                <div className="search-bar-wrapper">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input 
                        type="text" className="search-input" 
                        placeholder="Search by Representative Name or CCCD..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div className="groups-list">
            {loading ? (
                <div style={{textAlign:'center', marginTop:'50px'}}>
                    <i className="fa-solid fa-spinner fa-spin" style={{fontSize: '24px', marginRight:'10px'}}></i>
                    Loading data...
                </div>
            ) : filteredGroups.length === 0 ? (
                <p style={{textAlign:'center', color:'#888', marginTop:'50px'}}>No groups found.</p>
            ) : (
                filteredGroups.map(group => {
                    const canPay = isGroupReadyForPayment(group.rooms);
                    return (
                        <div className="group-section" key={group.groupId}>
                            <div className="group-header">
                                <div className="rep-info">
                                    <h3><i className="fa-solid fa-user-tie"></i> {group.repName}</h3>
                                    <span><i className="fa-solid fa-id-card"></i> CCCD: {group.repCCCD}</span>
                                    <span style={{marginLeft:'15px', fontSize:'13px', color:'#888'}}>({group.rooms.length} Rooms)</span>
                                </div>
                                {group.isPaid ? (
                                    <div className="paid-badge">
                                        <i className="fa-solid fa-check-circle"></i> Paid
                                    </div>
                                ) : (
                                    <button 
                                        className={`btn-group-payment ${canPay ? 'enabled' : 'disabled'}`} 
                                        onClick={() => handleGroupPayment(group)} 
                                        disabled={!canPay}
                                    >
                                        Payment for Group
                                    </button>
                                )}
                            </div>

                            <div className="group-rooms">
                                {group.rooms.map(item => {
                                    const checkInDisplay = item.checkIn ? new Date(item.checkIn).toLocaleString('en-GB') : 'Not yet';
                                    const checkOutDisplay = item.checkOut ? new Date(item.checkOut).toLocaleString('en-GB') : 'Not yet';
                                    
                                    const isPending = item.status === 'pending';
                                    // const isCheckedIn = item.status === 'checked-in'; // Không cần dùng biến này để disable nữa
                                    // const isCheckedOut = item.status === 'checked-out';

                                    return (
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
                                                        <div className="date-box date-checkin">In: {checkInDisplay}</div>
                                                        <div className="date-box date-checkout">Out: {checkOutDisplay}</div>
                                                    </div>
                                                </div>
                                                <div className="card-links">View rules | Get directions | Call hotel</div>
                                            </div>
                                            <div className="card-action-right">
                                                <div className="price-group">
                                                    <div className="total-price">${item.totalPrice}</div>
                                                </div>
                                                
                                                <div className="action-buttons-row">
                                                    <button 
                                                        className="btn-action btn-checkin" 
                                                        onClick={() => initiateAction('checkin', group, item)}
                                                        disabled={!isPending} 
                                                    >
                                                        Check-in
                                                    </button>

                                                    <button 
                                                        className="btn-action btn-checkout" 
                                                        onClick={() => initiateAction('checkout', group, item)}
                                                        // [UPDATED] Enabled always as requested
                                                    >
                                                        Check-out
                                                    </button>

                                                    <button 
                                                        className="btn-action btn-compensate" 
                                                        onClick={() => openCompensationModal(item)}
                                                        // [UPDATED] Enabled always as requested
                                                    >
                                                        Compensate
                                                    </button>

                                                    {isPending && (
                                                        <button 
                                                            className="btn-action btn-cancel" 
                                                            onClick={() => initiateAction('cancel', group, item)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

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
                    <button 
                        className={`btn-cm-confirm ${modalConfig.type === 'cancel' ? 'delete' : ''}`} 
                        onClick={executeAction}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</> : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {showCompModal && (
        <div className="modal-overlay">
            <div className="comp-modal">
                <h3 className="comp-title">Add Compensation</h3>
                <div className="form-group">
                    <label className="form-label">Room ID:</label>
                    <input className="form-input" type="text" value={compData.maPhong} disabled style={{background:'#f0f0f0'}} />
                </div>
                <div className="form-group">
                    <label className="form-label">Equipment Name:</label>
                    <input 
                        className="form-input" 
                        type="text" 
                        value={compData.tenThietBi} 
                        onChange={(e) => setCompData({...compData, tenThietBi: e.target.value})}
                        placeholder="e.g. Broken Glass, Towel..."
                    />
                </div>
                <div style={{display:'flex', gap:'15px'}}>
                    <div className="form-group" style={{flex:1}}>
                        <label className="form-label">Quantity:</label>
                        <input 
                            className="form-input" 
                            type="number" min="1"
                            value={compData.soLuong} 
                            onChange={(e) => setCompData({...compData, soLuong: e.target.value})}
                        />
                    </div>
                    <div className="form-group" style={{flex:1}}>
                        <label className="form-label">Amount ($):</label>
                        <input 
                            className="form-input" 
                            type="number" min="0"
                            value={compData.tienBoiThuong} 
                            onChange={(e) => setCompData({...compData, tienBoiThuong: e.target.value})}
                        />
                    </div>
                </div>
                <div className="comp-actions">
                    <button className="btn-comp-cancel" onClick={() => setShowCompModal(false)} disabled={isProcessing}>Cancel</button>
                    <button className="btn-comp-save" onClick={submitCompensation} disabled={isProcessing}>
                        {isProcessing ? 'Saving...' : 'Save Record'}
                    </button>
                </div>
            </div>
        </div>
      )}

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