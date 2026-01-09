import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import '../../App.css'; 

const BookingSearch = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [openDropdown, setOpenDropdown] = useState(null); 

  // State lưu giá trị đang chọn
  const [selections, setSelections] = useState({
    adults: 2,
    children: 0,
    bedType: 'Double', 
    bedQuantity: 2,
    roomClass: 'VIP', 
    checkIn: '', 
    checkOut: '' 
  });

  // Refs
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const dropdownRef = useRef(null);

  // --- HÀM HỖ TRỢ ---
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Select Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  // Danh sách hạng phòng (Tiếng Anh)
  const classOptions = ['Standard', 'Medium', 'Luxury', 'High-end', 'VIP'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelect = (field, value) => {
    setSelections({ ...selections, [field]: value });
    setOpenDropdown(null); 
  };

  // Xử lý tăng giảm số lượng khách
  const handleGuestChange = (type, operation) => {
    const currentValue = selections[type];
    if (operation === 'inc') {
        setSelections({ ...selections, [type]: currentValue + 1 });
    } else {
        if (currentValue > 0) setSelections({ ...selections, [type]: currentValue - 1 });
    }
  };

  // Xử lý tăng giảm số lượng giường (Max = 2)
  const handleBedQuantityChange = (operation) => {
    const currentQty = selections.bedQuantity;
    if (operation === 'inc') {
        if (currentQty < 2) { 
            setSelections({ ...selections, bedQuantity: currentQty + 1 });
        }
    } else {
        if (currentQty > 1) { 
            setSelections({ ...selections, bedQuantity: currentQty - 1 });
        }
    }
  };

  // Xử lý chọn loại giường (Single/Double)
  const handleBedTypeSelect = (type) => {
      setSelections({ ...selections, bedType: type });
  };

  const triggerDatePicker = (ref) => {
    if (ref.current) {
        // eslint-disable-next-line no-unused-vars
        try { ref.current.showPicker(); } catch (e) { ref.current.focus(); }
    }
  };

  // Dữ liệu phòng giả lập
  const rooms = [
    {
      id: 1,
      name: 'Coastal Solace Twin',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300&auto=format&fit=crop',
      desc: '1 night, 2 adults',
      cancellation: 'Free cancelation | No payment needed',
      cancellationNote: 'You cancel later, so lock in this great price today',
      features: ['Free parking', 'Free internet'],
      rating: 8.6,
      reviews: 706,
      price: 49
    },
    {
      id: 2,
      name: 'Coastal Twin View',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=300&auto=format&fit=crop',
      desc: '1 night, 2 adults',
      cancellation: 'Free cancelation | No payment needed',
      cancellationNote: 'You cancel later, so lock in this great price today',
      features: ['Free parking', 'Free internet'],
      rating: 8.6,
      reviews: 668,
      price: 79
    }
  ];

  return (
    <div className="booking-page-wrapper">
      {/* --- CSS NỘI BỘ --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        /* Áp dụng Font Poppins cho toàn trang */
        .booking-page-wrapper, button, input, select, h4, span, div {
            font-family: 'Poppins', sans-serif;
        }

        .booking-page-wrapper {
            background-color: #F5F5F0;
            min-height: 100vh;
            padding-bottom: 50px;
        }

        .booking-container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* --- SEARCH BAR SECTION --- */
        .search-bar-section {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            padding: 40px 0;
            gap: 10px;
            flex-wrap: wrap;
            position: relative;
            z-index: 10;
        }

        .search-box-item {
            background: white;
            padding: 10px 15px;
            border-radius: 12px;
            flex: 1; 
            min-width: 140px;
            min-height: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            cursor: pointer;
            position: relative;
            border: 1px solid transparent;
            transition: 0.2s;
        }
        
        .search-box-item:hover, .search-box-item.active {
            border-color: #0B2341;
        }

        .sb-text { display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
        .sb-text h4 {
            font-size: 14px; color: #0B2341; font-weight: 700; margin-bottom: 4px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px;
        }
        .sb-text span { font-size: 12px; color: #666; font-weight: 400; }
        .sb-icon { font-size: 14px; color: #000; margin-left: 5px; }

        /* Nút SEARCH ROOM */
        .btn-search-room {
            background-color: #0B2341; 
            color: white;
            padding: 0 25px;
            border-radius: 12px; 
            border: none;
            font-size: 16px; font-weight: 600; 
            cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 10px;
            min-height: 80px; 
            flex: 0 0 auto;
            transition: background 0.3s;
        }
        .btn-search-room:hover { background-color: #163a66; }

        .hidden-date-input {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            opacity: 0; cursor: pointer; z-index: 2;
        }

        /* --- DROPDOWN MENU CHUNG --- */
        .dropdown-menu {
            position: absolute; top: 115%; left: 0; width: 100%; min-width: 260px; /* Rộng hơn chút */
            background: white; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15); padding: 15px;
            z-index: 100; animation: fadeIn 0.2s ease-out;
            border: 1px solid #eee;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- STYLING CHO BED DROPDOWN (NEW) --- */
        .bed-dropdown-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .bed-section-title {
            font-size: 15px; font-weight: 700; color: #0B2341; margin-bottom: 5px;
        }
        
        /* Toggle Buttons (Single / Double) */
        .bed-type-options {
            display: flex; gap: 10px;
        }
        
        .bed-type-btn {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: white;
            color: #333;
            font-size: 14px; font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        /* Active State: Xanh đậm, chữ trắng */
        .bed-type-btn.active {
            background-color: #0B2341;
            color: white;
            border-color: #0B2341;
        }

        /* Quantity Row */
        .bed-qty-row {
            display: flex; justify-content: space-between; align-items: center;
            margin-top: 5px;
        }
        .bed-qty-label span { display: block; font-size: 15px; font-weight: 700; color: #0B2341; }
        .bed-qty-sub { font-size: 12px; color: #888; font-weight: 400; }
        
        /* Counter Controls */
        .qty-ctrl { display: flex; align-items: center; gap: 12px; }
        .btn-qty-circle {
            width: 32px; height: 32px; border-radius: 50%; 
            border: 1px solid #ddd; background: white;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer; font-size: 18px; color: #555; transition: 0.2s;
        }
        .btn-qty-circle:hover { border-color: #0B2341; color: #0B2341; }
        .qty-val { font-size: 16px; font-weight: 600; min-width: 15px; text-align: center; color: #0B2341; }

        /* Done Button */
        .btn-done-block {
            width: 100%;
            background-color: #0B2341; color: white;
            border: none; padding: 12px; border-radius: 8px;
            font-size: 15px; font-weight: 600; cursor: pointer;
            margin-top: 5px; transition: background 0.2s;
        }
        .btn-done-block:hover { background-color: #163a66; }

        /* --- Styles cho Guest Dropdown cũ --- */
        .guest-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
        .guest-row:last-child { border-bottom: none; }
        .guest-label { font-size: 14px; font-weight: 500; color: #0B2341; }
        
        /* --- Styles cho Class Dropdown cũ --- */
        .dd-item { padding: 10px 15px; border-radius: 8px; color: #333; font-size: 14px; cursor: pointer; transition: 0.2s; }
        .dd-item:hover { background-color: #F0F4F8; color: #0B2341; font-weight: 500; }
        .dd-item.selected { background-color: #E8F0FE; color: #0B2341; font-weight: 600; }

        /* Filter Section */
        .filter-header { font-size: 20px; font-weight: 600; color: #000; margin-bottom: 15px; }
        .filter-row { display: flex; gap: 30px; align-items: center; margin-bottom: 30px; flex-wrap: wrap; }
        .budget-box { background: white; padding: 15px 20px; border-radius: 12px; width: 250px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .budget-label { font-size: 14px; color: #000; margin-bottom: 8px; display: block; }
        .budget-input-wrapper { position: relative; }
        .budget-input { width: 100%; padding: 8px 15px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-family: 'Poppins', sans-serif; font-style: italic; }
        .currency-symbol { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-weight: 600; color: #000; }
        .info-pill { background: white; padding: 15px 30px; border-radius: 50px; flex: 1; display: flex; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.03); font-size: 15px; color: #000; }

        /* Room List */
        .room-list { display: flex; flex-direction: column; gap: 20px; }
        .room-card-item {
            background: white; border-radius: 12px; padding: 15px;
            display: flex; gap: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            transition: transform 0.2s; position: relative;
        }
        .room-card-item:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        .rc-img-container { width: 320px; height: 200px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
        .rc-img-container img { width: 100%; height: 100%; object-fit: cover; }
        .rc-info { flex: 1; display: flex; flex-direction: column; justify-content: flex-start; gap: 8px; }
        .rc-title { font-size: 20px; font-weight: 700; color: #000; margin: 0; }
        .rc-desc { font-size: 13px; color: #888; }
        .rc-cancel { font-size: 13px; font-weight: 600; color: #000; margin-top: 5px; }
        .rc-cancel-note { font-size: 12px; color: #333; }
        .rc-features { display: flex; gap: 15px; margin-top: auto; }
        .rc-feat-item { font-size: 12px; color: #888; display: flex; align-items: center; gap: 5px; }

        .rc-action {
            display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end;
            min-width: 160px;
        }
        .rating-box { display: flex; align-items: center; gap: 10px; text-align: right; }
        .r-status { font-size: 14px; font-weight: 600; color: #000; display: block; }
        .r-count { font-size: 11px; color: #888; }
        .yellow-star-badge { position: relative; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; }
        .yellow-star-badge i { font-size: 40px; color: #FFD700; } 
        .rating-num { position: absolute; font-size: 12px; font-weight: 700; color: #000; z-index: 1; top: 50%; left: 50%; transform: translate(-50%, -45%); }

        .price-button-wrapper { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .price-text { font-size: 22px; font-weight: 700; color: #0B2341; }
        .btn-see-avai {
            background-color: #0B2341; color: white; padding: 12px 25px;
            border-radius: 30px; border: none; font-size: 14px; font-weight: 600;
            cursor: pointer; text-decoration: none; transition: background 0.2s; white-space: nowrap;
        }
        .btn-see-avai:hover { background-color: #163a66; }

        @media (max-width: 1024px) {
            .search-bar-section { flex-wrap: wrap; }
            .search-box-item { flex: 1 1 30%; } 
        }
        @media (max-width: 768px) {
            .search-bar-section { flex-direction: column; }
            .search-box-item { width: 100%; }
            .btn-search-room { width: 100%; }
            .room-card-item { flex-direction: column; }
            .rc-img-container { width: 100%; height: 200px; }
            .rc-action { align-items: flex-start; flex-direction: row; justify-content: space-between; margin-top: 15px; width: 100%; }
            .price-button-wrapper { align-items: flex-end; }
        }
      `}</style>

      {/* --- SỬA Ở ĐÂY: THÊM role="customer" --- */}
      <Header isLoggedIn={true} useDarkTheme={true} role="customer" />

      <div className="booking-container">
        
        {/* --- 1. SEARCH BAR --- */}
        <div className="search-bar-section" ref={dropdownRef}>
            
            {/* 1. GUESTS */}
            <div className={`search-box-item ${openDropdown === 'guests' ? 'active' : ''}`} onClick={() => toggleDropdown('guests')}>
                <div className="sb-text">
                    <h4>{selections.adults} Adults, {selections.children} Child</h4>
                    <span>Guests</span>
                </div>
                <i className="fa-solid fa-caret-down sb-icon"></i>
                {openDropdown === 'guests' && (
                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="guest-row">
                            <div className="guest-label">Adults</div>
                            <div className="qty-ctrl">
                                <div className="btn-qty-circle" onClick={() => handleGuestChange('adults', 'dec')}>-</div>
                                <span className="qty-val">{selections.adults}</span>
                                <div className="btn-qty-circle" onClick={() => handleGuestChange('adults', 'inc')}>+</div>
                            </div>
                        </div>
                        <div className="guest-row" style={{marginTop: '10px'}}>
                            <div className="guest-label">Children</div>
                            <div className="qty-ctrl">
                                <div className="btn-qty-circle" onClick={() => handleGuestChange('children', 'dec')}>-</div>
                                <span className="qty-val">{selections.children}</span>
                                <div className="btn-qty-circle" onClick={() => handleGuestChange('children', 'inc')}>+</div>
                            </div>
                        </div>
                        <button className="btn-done-block" onClick={() => setOpenDropdown(null)}>Done</button>
                    </div>
                )}
            </div>

            {/* 2. BEDS (ĐÃ CẬP NHẬT GIỐNG HÌNH) */}
            <div className={`search-box-item ${openDropdown === 'beds' ? 'active' : ''}`} onClick={() => toggleDropdown('beds')}>
                <div className="sb-text">
                    <h4>{selections.bedQuantity} {selections.bedType} Bed(s)</h4>
                    <span>Bed Type & Qty</span>
                </div>
                <i className="fa-solid fa-caret-down sb-icon"></i>
                
                {openDropdown === 'beds' && (
                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="bed-dropdown-container">
                            {/* Phần chọn loại giường */}
                            <div className="bed-section-title">Bed Type</div>
                            <div className="bed-type-options">
                                <button 
                                    className={`bed-type-btn ${selections.bedType === 'Single' ? 'active' : ''}`}
                                    onClick={() => handleBedTypeSelect('Single')}
                                >
                                    Single
                                </button>
                                <button 
                                    className={`bed-type-btn ${selections.bedType === 'Double' ? 'active' : ''}`}
                                    onClick={() => handleBedTypeSelect('Double')}
                                >
                                    Double
                                </button>
                            </div>

                            {/* Phần chọn số lượng */}
                            <div className="bed-qty-row">
                                <div className="bed-qty-label">
                                    <span>Quantity</span>
                                    <div className="bed-qty-sub">Number of beds</div>
                                </div>
                                <div className="qty-ctrl">
                                    <div className="btn-qty-circle" onClick={() => handleBedQuantityChange('dec')}>-</div>
                                    <span className="qty-val">{selections.bedQuantity}</span>
                                    <div className="btn-qty-circle" onClick={() => handleBedQuantityChange('inc')}>+</div>
                                </div>
                            </div>

                            {/* Nút Done */}
                            <button className="btn-done-block" onClick={() => setOpenDropdown(null)}>
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. ROOM CLASS (Tiếng Anh) */}
            <div className={`search-box-item ${openDropdown === 'class' ? 'active' : ''}`} onClick={() => toggleDropdown('class')}>
                <div className="sb-text">
                    <h4>{selections.roomClass}</h4>
                    <span>Room Class</span>
                </div>
                <i className="fa-solid fa-caret-down sb-icon"></i>
                {openDropdown === 'class' && (
                    <div className="dropdown-menu">
                        {classOptions.map((opt, idx) => (
                            <div key={idx} className={`dd-item ${selections.roomClass === opt ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleSelect('roomClass', opt); }}>{opt}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. CHECK-IN */}
            <div className="search-box-item" onClick={() => triggerDatePicker(checkInRef)}>
                <div className="sb-text">
                    <h4>{formatDateDisplay(selections.checkIn)}</h4>
                    <span>Check-in</span>
                </div>
                <i className="fa-solid fa-calendar-days sb-icon"></i>
                <input type="date" ref={checkInRef} className="hidden-date-input" onChange={(e) => handleSelect('checkIn', e.target.value)} />
            </div>

            {/* 5. CHECK-OUT */}
            <div className="search-box-item" onClick={() => triggerDatePicker(checkOutRef)}>
                <div className="sb-text">
                     <h4>{formatDateDisplay(selections.checkOut)}</h4>
                    <span>Check-out</span>
                </div>
                <i className="fa-solid fa-calendar-days sb-icon"></i>
                <input type="date" ref={checkOutRef} className="hidden-date-input" onChange={(e) => handleSelect('checkOut', e.target.value)} />
            </div>

            {/* NÚT SEARCH */}
            <button className="btn-search-room">
                Search <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>

        {/* --- 2. FILTER & INFO --- */}
        <h3 className="filter-header">Filter Your Result</h3>
        <div className="filter-row">
            <div className="budget-box">
                <span className="budget-label">Your budget (per night)</span>
                <div className="budget-input-wrapper">
                    <input type="text" className="budget-input" placeholder="Enter here" />
                    <span className="currency-symbol">$</span>
                </div>
            </div>
            <div className="info-pill">Based on your filters, 80% of place to stay are available on our site.</div>
        </div>

        {/* --- 3. ROOM LIST --- */}
        <div className="room-list">
            {rooms.map((room) => (
                <div className="room-card-item" key={room.id}>
                    <div className="rc-img-container">
                        <img src={room.image} alt={room.name} />
                    </div>

                    <div className="rc-info">
                        <div>
                            <h3 className="rc-title">{room.name}</h3>
                            <p className="rc-desc">{room.desc}</p>
                            <p className="rc-cancel">{room.cancellation}</p>
                            <p className="rc-cancel-note">{room.cancellationNote}</p>
                        </div>
                        <div className="rc-features">
                            {room.features.map((feat, idx) => (
                                <span key={idx} className="rc-feat-item"><i className="fa-solid fa-check"></i> {feat}</span>
                            ))}
                        </div>
                    </div>

                    <div className="rc-action">
                        <div className="rating-box">
                            <div className="rating-text">
                                <span className="r-status">Excellent</span>
                                <span className="r-count">{room.reviews} reviews</span>
                            </div>
                            <div className="yellow-star-badge">
                                <i className="fa-solid fa-star"></i>
                                <span className="rating-num">{room.rating}</span>
                            </div>
                        </div>
                        
                        <div className="price-button-wrapper">
                            <div className="price-text">US ${room.price}</div>
                            <Link to="/booking/detail" className="btn-see-avai">See availability</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default BookingSearch;