import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import '../../App.css'; 

const ReceptionistCreateAccount = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        cccd: '', fullname: '', fromDate: '', toDate: '', members: ''
    });
    
    const [createdAccount, setCreatedAccount] = useState(null);

<<<<<<< HEAD
    // Get current date with format yyyy-mm-dd for [min] attribute
=======
    // Lấy ngày hiện tại định dạng YYYY-MM-DD để dùng cho thuộc tính min
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        
<<<<<<< HEAD
        // If change fromDate, reset toDate if toDate < fromDate
=======
        // Nếu thay đổi fromDate, cần reset toDate nếu toDate cũ nhỏ hơn fromDate mới
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
        if (name === 'fromDate') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                toDate: prev.toDate && prev.toDate <= value ? '' : prev.toDate
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

<<<<<<< HEAD
    // const handleCreate = () => {
    //     if (parseInt(formData.members) < 0) {
    //         alert("Number of members must be 0 or greater!");
    //         return;
    //     }
    //     if (!formData.cccd || !formData.fullname || !formData.fromDate || !formData.toDate || !formData.members) {
    //         alert("Please fill in all fields!");
    //         return;
    //     }
        
    //     // Constraint logic (avoid user typing incorrect data)
    //     if (formData.toDate <= formData.fromDate) {
    //         alert("The 'To' date must be after the 'From' date!");
    //         return;
    //     }
        
    //     const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    //     const username = `RES${formData.cccd.slice(-4)}${randomSuffix}`;
    //     const password = Math.random().toString(36).slice(-8).toUpperCase();

    //     setCreatedAccount({
    //         username: username,
    //         password: password,
    //         leader: formData.fullname,
    //         members: formData.members
    //     });
    // };

    const handleCreate = async () => {
=======
    const handleCreate = () => {
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
        if (parseInt(formData.members) < 0) {
            alert("Number of members must be 0 or greater!");
            return;
        }
        if (!formData.cccd || !formData.fullname || !formData.fromDate || !formData.toDate || !formData.members) {
            alert("Please fill in all fields!");
            return;
        }
<<<<<<< HEAD
=======
        
        // Ràng buộc logic (phòng trường hợp người dùng cố tình nhập tay thay vì chọn lịch)
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
        if (formData.toDate <= formData.fromDate) {
            alert("The 'To' date must be after the 'From' date!");
            return;
        }
<<<<<<< HEAD

        try {
            const payload = {
                representative: formData.fullname,
                cccd: formData.cccd,
                members: formData.members,
                startDate: formData.fromDate,
                endDate: formData.toDate
            };

            const response = await fetch('http://localhost:3000/api/create-visitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                setCreatedAccount({
                    username: data.username,
                    password: data.password,
                    leader: formData.fullname,
                    members: formData.members
                });
            } else {
                alert("Error in server: " + (data.message || "Cannot save"));
            }

        } catch (error) {
            console.error("Connection error:", error);
            alert("Connection error");
        }
=======
        
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const username = `RES${formData.cccd.slice(-4)}${randomSuffix}`;
        const password = Math.random().toString(36).slice(-8).toUpperCase();

        setCreatedAccount({
            username: username,
            password: password,
            leader: formData.fullname,
            members: formData.members
        });
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
    };

    const handleOk = () => {
        navigate('/receptionist/');
    };

    return (
        <div className="recep-page-container">
            <Header isLoggedIn={true} useDarkTheme={true} />

            <div className="recep-content-area">
                <div className="back-btn-wrapper">
                    <Link to="/receptionist/" className="back-home-link">
                        <i className="fa-solid fa-arrow-left"></i> Back to Home
                    </Link>
                </div>

                <div className="recep-form-card">
                    <h2 className="create-title">Create Visitor Account</h2>
                    
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
                    
                    <div className="form-section">
                        <h3 className="form-heading">Duration</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>From</label>
                                <input 
                                    type="date" 
                                    name="fromDate" 
                                    value={formData.fromDate} 
                                    onChange={handleChange}
<<<<<<< HEAD
                                    min={today}
=======
                                    min={today} // Làm mờ các ngày trước ngày thực tế
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
                                />
                            </div>
                            <div className="form-group">
                                <label>To</label>
                                <input 
                                    type="date" 
                                    name="toDate" 
                                    value={formData.toDate} 
                                    onChange={handleChange}
<<<<<<< HEAD
                                    min={formData.fromDate ? new Date(new Date(formData.fromDate).getTime() + 86400000).toISOString().split('T')[0] : today}
                                    disabled={!formData.fromDate}
=======
                                    // Làm mờ các ngày từ From trở về trước (phải lớn hơn From ít nhất 1 ngày)
                                    min={formData.fromDate ? new Date(new Date(formData.fromDate).getTime() + 86400000).toISOString().split('T')[0] : today}
                                    disabled={!formData.fromDate} // Khóa ô To nếu chưa chọn ô From
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Number of members</label>
                            <input type="number" name="members" placeholder="2, 3, 4,..." value={formData.members} onChange={handleChange} min="0" />
                        </div>
                    </div>
                    <button className="create-acc-btn" onClick={handleCreate}>Create</button>
                </div>
            </div>

            {createdAccount && (
                <div className="modal-overlay">
                    <div className="success-box">
                        <div className="success-icon-circle">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h3 className="modal-title">Your account is created successfully!</h3>
                        <div className="modal-body-content">
                            <p className="modal-subtitle">Credentials for <strong>{createdAccount.leader}</strong>:</p>
                            <div className="modal-field">
                                <label className="modal-label">Username</label>
                                <div className="modal-value-box">{createdAccount.username}</div>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Password</label>
                                <div className="modal-value-box password-text">{createdAccount.password}</div>
                            </div>
                        </div>
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