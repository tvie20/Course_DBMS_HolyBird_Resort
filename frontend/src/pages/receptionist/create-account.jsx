import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../App.css'; 

const ReceptionistCreateAccount = () => {
  const navigate = useNavigate(); // 2. Khởi tạo navigate

  const [formData, setFormData] = useState({
    cccd: '', fullname: '', fromDate: '', toDate: '', members: ''
  });
  
  // State này dùng để điều khiển việc hiện Popup
  const [createdAccount, setCreatedAccount] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = () => {
    if (parseInt(formData.members) < 0) {
        alert("Number of members must be 0 or greater!");
        return;
    }
    if (!formData.cccd || !formData.fullname || !formData.fromDate || !formData.toDate || !formData.members) {
      alert("Please fill in all fields!");
      return;
    }
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `RES${formData.cccd.slice(-4)}${randomSuffix}`;
    const password = Math.random().toString(36).slice(-8).toUpperCase();

    // Khi setCreatedAccount có dữ liệu, Popup sẽ hiện ra
    setCreatedAccount({
      username: username,
      password: password,
      leader: formData.fullname,
      members: formData.members
    });
  };

  // 3. Hàm xử lý nút OK -> Về trang chủ
  const handleOk = () => {
    navigate('/receptionist/home');
  };

  return (
    <div className="recep-page-container">
      
      <Header isLoggedIn={true} useDarkTheme={true} />

      <div className="recep-content-area">
        
        <div className="back-btn-wrapper">
            <Link to="/receptionist" className="back-home-link">
                <i className="fa-solid fa-arrow-left"></i> Back to Home
            </Link>
        </div>

        <div className="recep-form-card">
            {/* 4. Form luôn luôn hiển thị (bỏ toán tử 3 ngôi check !createdAccount) */}
            <div className="form-section">
                <h3 className="form-heading">Representative</h3>
                <div className="form-group">
                    <label>CCCD</label>
                    <input type="text" name="cccd" placeholder="Ex: 07909xxxxxxx" value={formData.cccd} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Fullname</label>
                    <input type="text" name="fullname" placeholder="Full name of representative" value={formData.fullname} onChange={handleChange} />
                </div>
            </div>
            
            <div className="form-divider"></div>
            
            <div className="form-section">
                <h3 className="form-heading">Duration</h3>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>From</label>
                        <div className="date-input-wrapper">
                            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>To</label>
                        <div className="date-input-wrapper">
                            <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Number of members</label>
                    <input 
                        type="number" 
                        name="members" 
                        placeholder="2, 3, 4,..." 
                        value={formData.members} 
                        onChange={handleChange} 
                        min="0"
                    />
                </div>
            </div>
            <button className="create-acc-btn" onClick={handleCreate}>Create</button>
        </div>
      </div>

      {/* 5. POPUP OVERLAY - Chỉ hiện khi createdAccount có dữ liệu */}
      {createdAccount && (
        <div className="modal-overlay">
            {/* Thêm class modal-content-box để có hiệu ứng popup đẹp, kết hợp class cũ account-result */}
            <div className="account-result modal-content-box">
                <h3 className="result-title">Account Created Successfully!</h3>
                <p>Please provide these credentials to the representative:</p>
                <div className="credential-box">
                    <p><strong>Representative:</strong> {createdAccount.leader}</p>
                    <p><strong>Username:</strong> <span className="highlight">{createdAccount.username}</span></p>
                    <p><strong>Password:</strong> <span className="highlight">{createdAccount.password}</span></p>
                    <p><strong>Number of members:</strong> {createdAccount.members}</p>
                </div>
                {/* Đổi nút thành OK và gọi handleOk */}
                <button className="create-acc-btn" onClick={handleOk}>OK</button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionistCreateAccount;