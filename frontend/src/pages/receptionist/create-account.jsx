import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../App.css'; 

const ReceptionistCreateAccount = () => {
  const navigate = useNavigate();
  const hiddenFromDateRef = useRef(null);
  const hiddenToDateRef = useRef(null);

  const [formData, setFormData] = useState({
    cccd: '', fullname: '', fromDate: '', toDate: '', members: ''
  });
  
  const [createdAccount, setCreatedAccount] = useState(null);

  const formatDateDisplay = (isoDateString) => {
    if (!isoDateString) return '';
    const [year, month, day] = isoDateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openDatePicker = (ref) => {
    if (ref.current) {
        try { ref.current.showPicker(); } 
        catch (error) { ref.current.focus(); }
    }
  };

  const handleCreate = () => {
    // Validate đơn giản
    if (!formData.cccd || !formData.fullname || !formData.fromDate || !formData.toDate || !formData.members) {
      alert("Please fill in all fields!");
      return;
    }
    
    // Giả lập dữ liệu
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `247${formData.cccd.slice(-4)}${randomSuffix}`; 
    const password = Math.random().toString(36).slice(-8).toLowerCase();

    setCreatedAccount({
      username: username,
      password: password,
      leader: formData.fullname,
      members: formData.members
    });
  };

  const handleOk = () => {
    navigate('/receptionist'); 
  };

  return (
    <div className="recep-page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        /* --- STYLES CHO TRANG CHÍNH --- */
        .recep-page-wrapper {
            background-color: #F5F5F0; 
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
            display: flex; flex-direction: column;
        }
        .recep-content-center {
            flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px 20px;
        }
        .recep-form-container { width: 100%; max-width: 450px; }
        .form-section-title {
            font-size: 18px; font-weight: 500; color: #111; margin-bottom: 15px; margin-top: 10px;
        }
        .input-group { margin-bottom: 20px; display: flex; flex-direction: column; }
        .input-group label { font-size: 15px; font-weight: 500; color: #333; margin-bottom: 8px; }
        .styled-input {
            width: 100%; padding: 14px 16px; border-radius: 8px; border: none;
            background-color: #FFFFFF; font-size: 15px; font-family: 'Poppins', sans-serif;
            color: #333; outline: none; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .styled-input::placeholder { font-style: italic; color: #C4C4C4; font-weight: 300; }
        .dashed-line { border-top: 2px dashed #bbb; margin: 25px 0 30px 0; opacity: 0.7; }
        .date-input-wrapper { position: relative; width: 100%; cursor: pointer; }
        .visible-date-input {
            width: 100%; padding: 14px 16px; border-radius: 8px; border: none;
            background-color: #FFFFFF; font-size: 15px; font-family: 'Poppins', sans-serif;
            color: #333; outline: none; box-shadow: 0 2px 4px rgba(0,0,0,0.02); cursor: pointer;
        }
        .visible-date-input::placeholder { font-style: italic; color: #C4C4C4; font-weight: 300; }
        .hidden-date-input { position: absolute; bottom: 0; left: 0; width: 0; height: 0; opacity: 0; }
        .calendar-icon-right {
            position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
            font-size: 20px; color: #000; pointer-events: none;
        }
        .btn-create-wrapper { display: flex; justify-content: center; margin-top: 35px; }
        .btn-create {
            background-color: #0B2341; color: white; font-family: 'Poppins', sans-serif;
            font-size: 18px; font-weight: 500; padding: 12px 60px; border: none;
            border-radius: 8px; cursor: pointer; transition: background 0.3s;
        }
        .btn-create:hover { background-color: #163a66; }

        /* --- POPUP MODAL STYLES (MATCH SOURCE 63) --- */
        .modal-overlay { 
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background-color: rgba(0, 0, 0, 0.4); 
            display: flex; justify-content: center; align-items: center; 
            z-index: 9999; backdrop-filter: blur(2px); 
        }

        .success-box { 
            background: white; 
            padding: 30px 40px; 
            border-radius: 12px; 
            width: 450px; 
            text-align: center; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.2); 
            animation: popIn 0.3s ease-out; 
            position: relative;
        }

        @keyframes popIn {
            from { transform: scale(0.9); opacity: 0; } 
            to { transform: scale(1); opacity: 1; }
        }

        /* Icon xanh lá cây */
        .success-icon-circle { 
            width: 60px; height: 60px; 
            background-color: #02C202; /* Màu xanh lá tươi giống hình */
            border-radius: 50%; 
            margin: 0 auto 15px; 
            display: flex; justify-content: center; align-items: center; 
        }
        .success-icon-circle i { 
            color: white; font-size: 32px; font-weight: bold; 
        }

        /* Tiêu đề */
        .modal-title { 
            font-size: 18px; font-weight: 500; margin-bottom: 25px; color: #222; 
        }

        /* Layout các trường Username/Pass */
        .modal-field {
            text-align: left;
            margin-bottom: 15px;
        }

        .modal-label {
            font-size: 14px;
            font-weight: 500;
            color: #444;
            margin-bottom: 5px;
            display: block;
        }

        /* Ô chứa giá trị (giống input nhưng read-only) */
        .modal-value-box {
            background-color: #FCFCF9; /* Màu nền hơi kem/xám nhạt */
            padding: 12px 15px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            color: #E57373; /* Màu đỏ cam giống hình */
            border: none; /* Không viền hoặc viền rất nhạt nếu muốn */
        }

        /* Nút OK nằm bên phải */
        .modal-actions {
            display: flex;
            justify-content: flex-end; /* Đẩy nút sang phải */
            margin-top: 25px;
        }

        .btn-ok { 
            background-color: #0B2341; 
            color: white; 
            padding: 10px 45px; 
            border-radius: 6px; 
            border: none; 
            cursor: pointer; 
            font-size: 16px; 
            font-family: 'Poppins', sans-serif; 
            font-weight: 500;
            transition: background 0.2s;
        }
        .btn-ok:hover { background-color: #163a66; }

      `}</style>

      <Header isLoggedIn={true} useDarkTheme={true} />

      <div className="recep-content-center">
        <div className="recep-form-container">
            {/* FORM INPUTS (Giữ nguyên phần trước) */}
            <div className="form-section">
                <h3 className="form-section-title">Representative</h3>
                <div className="input-group">
                    <label>CCCD</label>
                    <input type="text" name="cccd" placeholder="CCCD" className="styled-input" value={formData.cccd} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Fullname</label>
                    <input type="text" name="fullname" placeholder="Fullname" className="styled-input" value={formData.fullname} onChange={handleChange} />
                </div>
            </div>
            
            <div className="dashed-line"></div>
            
            <div className="form-section">
                <h3 className="form-section-title">Duration</h3>
                <div className="input-group">
                    <label>From</label>
                    <div className="date-input-wrapper" onClick={() => openDatePicker(hiddenFromDateRef)}>
                        <input type="text" placeholder="dd/mm/yyyy" className="visible-date-input" value={formatDateDisplay(formData.fromDate)} readOnly />
                        <input type="date" name="fromDate" ref={hiddenFromDateRef} className="hidden-date-input" onChange={handleChange} />
                        <i className="fa-regular fa-calendar-days calendar-icon-right"></i>
                    </div>
                </div>

                <div className="input-group">
                    <label>To</label>
                    <div className="date-input-wrapper" onClick={() => openDatePicker(hiddenToDateRef)}>
                        <input type="text" placeholder="dd/mm/yyyy" className="visible-date-input" value={formatDateDisplay(formData.toDate)} readOnly />
                        <input type="date" name="toDate" ref={hiddenToDateRef} className="hidden-date-input" onChange={handleChange} />
                        <i className="fa-regular fa-calendar-days calendar-icon-right"></i>
                    </div>
                </div>

                <div className="input-group">
                    <label>Number of members</label>
                    <input type="text" name="members" placeholder="2, 3, 4,..." className="styled-input" value={formData.members} onChange={handleChange} />
                </div>
            </div>

            <div className="btn-create-wrapper">
                 <button className="btn-create" onClick={handleCreate}>Create</button>
            </div>
        </div>
      </div>

      [cite_start]{/* --- POPUP THÀNH CÔNG GIỐNG HÌNH III.11 [cite: 63] --- */}
      {createdAccount && (
        <div className="modal-overlay">
            <div className="success-box">
                {/* Icon Check */}
                <div className="success-icon-circle">
                    <i className="fa-solid fa-check"></i>
                </div>
                
                <h3 className="modal-title">Your account is created successfully!</h3>
                
                {/* Username Field */}
                <div className="modal-field">
                    <label className="modal-label">Username</label>
                    <div className="modal-value-box">
                        {createdAccount.username}
                    </div>
                </div>

                {/* Password Field */}
                <div className="modal-field">
                    <label className="modal-label">Password</label>
                    <div className="modal-value-box">
                        {createdAccount.password}
                    </div>
                </div>

                {/* OK Button aligned Right */}
                <div className="modal-actions">
                    <button className="btn-ok" onClick={handleOk}>OK</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistCreateAccount;