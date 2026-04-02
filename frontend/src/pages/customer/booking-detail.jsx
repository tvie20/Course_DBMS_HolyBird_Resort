import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { useNavigate, useLocation } from 'react-router-dom' 
import '../../App.css' 

const BookingDetail = () => {
  const navigate = useNavigate()
  
  // Lấy roomId từ trang trước, fallback là P0001
  const location = useLocation()
  const roomId = location.state?.roomId || 'P0001' 

  // --- STATE ---
  const [showModal, setShowModal] = useState(false)          
  const [showSuccessModal, setShowSuccessModal] = useState(false) 
  const [alertModal, setAlertModal] = useState({ show: false, message: '' })

  const [showMemberDropdown, setShowMemberDropdown] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false) 

  const [currentUser, setCurrentUser] = useState(null)
  const [selectedBookingId, setSelectedBookingId] = useState('') 
  const [bookingList, setBookingList] = useState([]) 
  const [availableMembers, setAvailableMembers] = useState([]) 
  
  const [tempSelectedIds, setTempSelectedIds] = useState([])
  const [addedMembers, setAddedMembers] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  // [MỚI] State chứa thông tin phòng lấy từ API (Ban đầu là null)
  const [apiRoomData, setApiRoomData] = useState(null);

  // --- DỮ LIỆU MẪU (STATIC DATA) - GIỮ NGUYÊN KHÔNG XÓA ---
  const staticRoomData = {
    name: 'Deluxe Twin Garden with Children Themed Room', // Tên mặc định nếu API lỗi
    desc: 'This spacious room features a luxurious two twin beds and a vibrant children themed room with decor. Overlooking lush gardens, it includes modern amenities, private balcony, and bathroom with a hand-carved bathtub with Rain shower. Perfect for family gateways, enjoy the kid’s club and tailored resort activities for all ages.',
    price: 79, // Giá mặc định
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
  }

  // --- API CALLS ---

  // [MỚI] API lấy chi tiết phòng thật
  const fetchRoomDetail = async () => {
      try {
          // Gọi API /api/rooms/:id mà ta đã tạo ở backend
          const res = await fetch(`http://localhost:3000/api/rooms/${roomId}`);
          const data = await res.json();
          if (data.success) {
              setApiRoomData(data.data);
          }
      } catch (err) {
          console.error("Error fetching room detail:", err);
      }
  }

  const bookRoomAPI = async (payload) => {
    const res = await fetch('http://localhost:3000/api/booking/book-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    return res.json()
  }

  const fetchBookingList = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/bookings')
        const data = await res.json()
        if (data.success) setBookingList(data.data)
    } catch (err) { console.error(err) }
  }

  const fetchMembers = async (maGiaoDich) => {
    try {
        const res = await fetch(`http://localhost:3000/api/booking/${maGiaoDich}/members`)
        const data = await res.json()
        if (data.success) {
            const mappedMembers = data.data.map(m => ({
                id: m.MaKhachHang, name: m.HoTen, cccd: m.CMND, phone: m.SoDienThoai, 
                dob: new Date(m.NgaySinh).toLocaleDateString('en-GB'), gender: m.GioiTinh
            }))
            setAvailableMembers(mappedMembers)
        }
    } catch (err) { console.error(err) }
  }

  // --- EFFECTS ---
  useEffect(() => {
    // 1. Load User Info
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      const user = JSON.parse(userStr)
      setCurrentUser(user)
      if (user.Role === 'KHACH-HANG' && user.MaGiaoDich) setSelectedBookingId(user.MaGiaoDich)
      if (user.Role === 'TIEP-TAN') fetchBookingList()
    }

    // 2. [MỚI] Gọi API lấy thông tin phòng ngay khi vào trang
    fetchRoomDetail();
  }, []) // eslint-disable-line

  useEffect(() => {
    if (selectedBookingId) fetchMembers(selectedBookingId)
    else setAvailableMembers([])
  }, [selectedBookingId])

  // --- HANDLERS ---
  const handleBookClick = () => { setIsConfirmed(false); setShowModal(true); }
  const handleCloseModal = () => { setShowModal(false); }
  const handleCheckboxChange = (id) => { setTempSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]) }
  const handleAddMembers = () => { const selectedObj = availableMembers.filter(m => tempSelectedIds.includes(m.id)); setAddedMembers(selectedObj); setShowMemberDropdown(false); }
  const handleBookingSelectChange = (e) => { setSelectedBookingId(e.target.value); setTempSelectedIds([]); setAddedMembers([]); }

  const handleFinalBook = async () => {
    if (addedMembers.length === 0) { setAlertModal({ show: true, message: "Please add at least one member!" }); return; }
    if (!isConfirmed) { setAlertModal({ show: true, message: "Please confirm the information!" }); return; }

    setIsLoading(true)
    try {
        let transId = currentUser?.Role === 'TIEP-TAN' ? selectedBookingId : currentUser?.MaGiaoDich
        const payload = { roomId: roomId, transactionId: transId, members: addedMembers }
        const result = await bookRoomAPI(payload)

        if (result.success) { setShowModal(false); setShowSuccessModal(true); } 
        else { setAlertModal({ show: true, message: result.message || "Booking Failed" }); }
    } catch { setAlertModal({ show: true, message: "Error connecting to server" }); } 
    finally { setIsLoading(false); }
  }

  const handleSuccessOk = () => { setShowSuccessModal(false); if (currentUser?.Role === 'TIEP-TAN') navigate('/receptionist'); else navigate('/customer'); }
  const closeAlertModal = () => { setAlertModal({ ...alertModal, show: false }); }

  // --- [LOGIC HIỂN THỊ] ---
  // Nếu có apiRoomData thì dùng, không thì dùng staticRoomData
  const displayPrice = apiRoomData ? apiRoomData.DonGia : staticRoomData.price;
  const displayTitle = apiRoomData 
      ? `${roomId} - ${apiRoomData.TenHang} (${apiRoomData.LoaiGiuong} Bed)` 
      : `${roomId} - ${staticRoomData.name}`;
  const isOccupied = apiRoomData ? apiRoomData.TrangThai !== 'Rảnh' : false;

  return (
    <div className="detail-page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .detail-page-wrapper, button, input, h1, h2, h3, h4, p, span, div, label, select { font-family: 'Poppins', sans-serif; }
        .detail-page-wrapper { background-color: #F5F5F0; min-height: 100vh; padding-bottom: 50px; }
        .detail-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; display: flex; gap: 40px; align-items: flex-start; }

        /* Gallery & Info Styles (Giữ nguyên) */
        .gallery-column { flex: 0 0 280px; display: flex; flex-direction: column; gap: 15px; }
        .gallery-img-item { width: 100%; height: 160px; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
        .gallery-img-item:hover { transform: scale(1.02); }
        .gallery-img-item img { width: 100%; height: 100%; object-fit: cover; }
        .info-column { flex: 1; }
        .room-title { font-size: 24px; font-weight: 500; color: #000; margin-bottom: 10px; line-height: 1.3; }
        
        /* [MỚI] Tags hiển thị thông tin thêm từ API */
        .room-meta-tags { display: flex; gap: 10px; margin-bottom: 20px; }
        .meta-tag { font-size: 13px; padding: 5px 12px; border-radius: 20px; font-weight: 600; display: flex; align-items: center; gap: 5px; }
        .tag-gray { background: #eee; color: #333; }
        .tag-status-Rảnh { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .tag-status-Bận { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

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
        .btn-book-large:disabled { background-color: #ccc; cursor: not-allowed; }

        /* MODAL Styles (Giữ nguyên) */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(2px); }
        .booking-modal { background-color: #fcfcfc; width: 850px; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto; }
        .bm-heading { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 20px; }
        .guest-details-section { margin-bottom: 40px; }
        .selection-area { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
        .select-booking-box { padding: 10px 15px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; color: #000; outline: none; min-width: 250px; }
        .dropdown-wrapper { position: relative; display: inline-block; }
        .btn-choose-members { background: white; border: 1px solid #ccc; border-radius: 8px; padding: 10px 20px; font-size: 15px; font-weight: 600; color: #000; cursor: pointer; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .btn-choose-members:disabled { background: #eee; color: #999; cursor: not-allowed; }
        .members-dropdown-popup { position: absolute; top: 110%; left: 0; background: white; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.15); padding: 20px; width: 320px; z-index: 100; max-height: 300px; overflow-y: auto; }
        .member-checkbox-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 14px; color: #333; cursor: pointer; }
        .member-checkbox-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: #000; cursor: pointer; }
        .btn-add-member { background-color: #0B2341; color: white; border: none; padding: 8px 30px; border-radius: 20px; font-size: 14px; font-weight: 500; display: block; margin: 10px 0 0 auto; cursor: pointer; }
        .table-header-row { display: flex; justify-content: space-between; padding: 10px 20px; background-color: white; border-radius: 10px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .table-header-item { font-size: 14px; font-weight: 700; color: #000; text-align: center; flex: 1; }
        .table-data-row { display: flex; justify-content: space-between; padding: 10px 20px; background-color: transparent; border-bottom: 1px solid #eee; }
        .table-data-item { font-size: 14px; color: #333; text-align: center; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .booking-details-section { margin-bottom: 30px; }
        .booking-pills-container { display: flex; gap: 20px; margin-top: 15px; flex-wrap: wrap; }
        .info-pill { background: white; border-radius: 15px; padding: 15px 10px; min-width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1; }
        .pill-main-text { font-size: 16px; font-weight: 700; color: #39618b; margin-bottom: 2px; display: flex; align-items: center; gap: 8px; justify-content: center; }
        .pill-sub-text { font-size: 12px; color: #555; }
        .confirm-checkbox-wrapper { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; }
        .confirm-checkbox-wrapper input { width: 20px; height: 20px; accent-color: #000; cursor: pointer; }
        .confirm-text { font-size: 15px; color: #000; font-weight: 400; cursor: pointer; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 20px; }
        .btn-modal-action { background-color: #0B2341; color: white; padding: 12px 50px; border-radius: 25px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s; }
        .btn-modal-action:hover { background-color: #163a66; }
        .btn-modal-action:disabled { background-color: #ccc; cursor: not-allowed; }

        /* Popup Styles */
        .success-box { background: white; padding: 40px; border-radius: 20px; width: 450px; text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.2); animation: popIn 0.3s ease-out; position: relative; z-index: 10000; }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-icon-large { width: 70px; height: 70px; background-color: #00C851; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 25px; border: 5px solid #fff; box-shadow: 0 0 0 1px #eee; }
        .success-icon-large i { font-size: 35px; color: white; }
        .alert-icon-large { width: 70px; height: 70px; background-color: #FFC107; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 25px; border: 5px solid #fff; box-shadow: 0 0 0 1px #eee; }
        .alert-icon-large i { font-size: 35px; color: white; }
        .success-title { font-size: 20px; font-weight: 700; color: #000; margin-bottom: 15px; }
        .success-desc { font-size: 15px; color: #555; margin-bottom: 30px; }
        .btn-success-ok { background-color: #0B2341; color: white; padding: 10px 50px; border-radius: 25px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; }

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

      <Header isLoggedIn={true} useDarkTheme={true} role={currentUser?.Role === 'TIEP-TAN' ? 'staff' : 'customer'} />

      <div className="detail-container">
        
        {/* left: gallery (GIỮ NGUYÊN) */}
        <div className="gallery-column">
            {staticRoomData.images.map((imgUrl, index) => (
                <div className="gallery-img-item" key={index}>
                    <img src={imgUrl} alt={`Room detail ${index}`} />
                </div>
            ))}
        </div>

        {/* right: info */}
        <div className="info-column">
            {/* [SỬA] HIỂN THỊ TÊN DỰA VÀO API NẾU CÓ, KHÔNG THÌ DÙNG STATIC */}
            <h1 className="room-title">{displayTitle}</h1>
            
            {/* [MỚI] HIỂN THỊ THÔNG TIN API BỔ SUNG (TẦNG, SỐ GIƯỜNG, TRẠNG THÁI) */}
            {apiRoomData && (
                <div className="room-meta-tags">
                    <span className="meta-tag tag-gray"><i className="fa-solid fa-layer-group"></i> Floor: {apiRoomData.ViTriTang}</span>
                    <span className="meta-tag tag-gray"><i className="fa-solid fa-bed"></i> Beds: {apiRoomData.SoGiuong}</span>
                    <span className={`meta-tag tag-status-${apiRoomData.TrangThai}`}>
                        {apiRoomData.TrangThai === 'Rảnh' ? <i className="fa-solid fa-check-circle"></i> : <i className="fa-solid fa-ban"></i>}
                        {apiRoomData.TrangThai === 'Rảnh' ? 'Available' : 'Occupied'}
                    </span>
                </div>
            )}

            <p className="room-desc">{staticRoomData.desc}</p>

            <div className="amenities-grid">
                {staticRoomData.amenities.map((item, idx) => (
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
                            <span className="rt-count">{staticRoomData.reviews} reviews</span>
                        </div>
                        <div className="star-badge-large">
                            <i className="fa-solid fa-star"></i>
                            <span className="star-score">{staticRoomData.rating}</span>
                        </div>
                    </div>

                    {/* [SỬA] HIỂN THỊ GIÁ TỪ API (displayPrice) */}
                    <div className="final-price">US ${displayPrice}</div>
                    
                    {/* [SỬA] DISABLE NÚT NẾU PHÒNG BẬN */}
                    <button 
                        className="btn-book-large" 
                        onClick={handleBookClick} 
                        disabled={isOccupied} 
                        style={{ opacity: isOccupied ? 0.6 : 1, cursor: isOccupied ? 'not-allowed' : 'pointer' }}
                    >
                        {isOccupied ? 'Occupied' : 'Book'} 
                        {!isOccupied && <i className="fa-solid fa-arrow-right" style={{marginLeft:'10px'}}></i>}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* booking form modal */}
      {showModal && (
        <div className="modal-overlay">
            <div className="booking-modal">
                
                {/* guest details section */}
                <div className="guest-details-section">
                    <h3 className="bm-heading">Guest Details</h3>
                    
                    <div className="selection-area">
                        {/* 1. Receptionist Only: Dropdown to select Booking/Group */}
                        {currentUser?.Role === 'TIEP-TAN' && (
                            <div className="dropdown-wrapper">
                                <select className="select-booking-box" value={selectedBookingId} onChange={handleBookingSelectChange}>
                                    <option value="">-- Select Booking (Group) --</option>
                                    {bookingList.map(booking => (
                                        <option key={booking.MaGiaoDich} value={booking.MaGiaoDich}>
                                            {booking.MaGiaoDich} - {booking.TenDangNhap}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* 2. Dynamic Member Dropdown */}
                        <div className="dropdown-wrapper">
                            <button 
                                className="btn-choose-members" 
                                onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                                disabled={!selectedBookingId} 
                            >
                                {selectedBookingId ? 'Choose members' : 'Please select booking first'} 
                                <i className="fa-solid fa-caret-down"></i>
                            </button>
                            {showMemberDropdown && (
                                <div className="members-dropdown-popup">
                                    {availableMembers.length === 0 ? (
                                        <div style={{padding: '10px', color:'#666', fontSize:'13px'}}>No members found for this booking.</div>
                                    ) : (
                                        availableMembers.map(member => (
                                            <label key={member.id} className="member-checkbox-item">
                                                <input type="checkbox" checked={tempSelectedIds.includes(member.id)} onChange={() => handleCheckboxChange(member.id)} />
                                                ({member.id}) {member.name}
                                            </label>
                                        ))
                                    )}
                                    <button className="btn-add-member" onClick={handleAddMembers}>Done</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="table-header-row">
                        <span className="table-header-item">Id</span>
                        <span className="table-header-item">Name</span>
                        <span className="table-header-item">CCCD</span>
                        <span className="table-header-item">Phone</span>
                        <span className="table-header-item">Day of Birth</span>
                        <span className="table-header-item">Gender</span>
                    </div>
                    {addedMembers.length > 0 ? addedMembers.map(member => (
                        <div className="table-data-row" key={member.id}>
                            <span className="table-data-item">{member.id}</span>
                            <span className="table-data-item">{member.name}</span>
                            <span className="table-data-item">{member.cccd}</span>
                            <span className="table-data-item">{member.phone}</span>
                            <span className="table-data-item">{member.dob}</span>
                            <span className="table-data-item">{member.gender}</span>
                        </div>
                    )) : (
                        <div style={{textAlign:'center', padding:'20px', color:'#999', fontSize:'14px'}}>
                            No members selected yet.
                        </div>
                    )}
                </div>

                {/* booking details section */}
                <div className="booking-details-section">
                    <h3 className="bm-heading">Booking Details</h3>
                    <div className="booking-pills-container">
                        <div className="info-pill">
                            <span className="pill-main-text">{roomId}</span>
                            <span className="pill-sub-text">Room</span>
                        </div>
                        <div className="info-pill">
                            <span className="pill-main-text">
                                {apiRoomData ? apiRoomData.LoaiGiuong : 'Double'}
                            </span>
                            <span className="pill-sub-text">Bed Type</span>
                        </div>
                        <div className="info-pill">
                            <span className="pill-main-text">US ${displayPrice}</span>
                            <span className="pill-sub-text">Total Price</span>
                        </div>
                    </div>
                </div>

                <div className="confirm-checkbox-wrapper">
                    <input type="checkbox" id="confirm-check" checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />
                    <label htmlFor="confirm-check" className="confirm-text">I confirm that all the information I have provided is accurate.</label>
                </div>
                
                <div className="modal-actions">
                    <button className="btn-modal-action" onClick={handleCloseModal} disabled={isLoading}>Cancel</button>
                    <button 
                        className="btn-modal-action" 
                        onClick={handleFinalBook}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? 'Processing...' : 'Book'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* warning model */}
      {alertModal.show && (
        <div className="modal-overlay" style={{zIndex: 10001}}>
            <div className="success-box">
                <div className="alert-icon-large"><i className="fa-solid fa-exclamation"></i></div>
                <h3 className="success-title">Notice</h3>
                <p className="success-desc">{alertModal.message}</p>
                <button className="btn-success-ok" onClick={closeAlertModal}>OK</button>
            </div>
        </div>
      )}

      {/* success popup */}
      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="success-box">
                <div className="success-icon-large"><i className="fa-solid fa-check"></i></div>
                <h3 className="success-title">Booking Successful!</h3>
                <p className="success-desc">Your room has been booked successfully.</p>
                <button className="btn-success-ok" onClick={handleSuccessOk}>OK</button>
            </div>
        </div>
      )}

    </div>
  )
}

export default BookingDetail
