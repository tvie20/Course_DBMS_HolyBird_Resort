import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import imgLogin from '../assets/img-login.jpg'; 
import bgLogin from '../assets/bg-login.jpg'; 

const Login = () => {
  const navigate = useNavigate();

  // State quản lý form
  const [role, setRole] = useState('customer'); // Mặc định chọn Customer
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (role === 'customer') {
      // ĐÚNG: Chuyển về đường dẫn riêng của Customer
      navigate('/customer/'); 
    } else if (role === 'staff') {
      // ĐÚNG: Chuyển về đường dẫn riêng của Staff
      navigate('/receptionist/'); 
    }
  }

  return (
    <div className="login-page-wrapper" style={{ backgroundImage: `url(${bgLogin})` }}>
      
      <div className="login-card-container">
        
        {/* --- CỘT TRÁI: FORM LOGIN --- */}
        <div className="login-form-side">
          <div className="login-content-box">
            <h1 className="login-heading">LOG IN</h1>
            <p className="login-subtext">
              Welcome to Holybird resort,<br />
              Wish you have a memorable trip!
            </p>

            <form onSubmit={handleLogin}>
              
              {/* Username Input */}
              <div className="input-block">
                <label>Username*</label>
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="glass-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="input-block">
                <label>Password*</label>
                <div className="password-field-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="glass-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i 
                    className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>

              {/* Checkbox Role Selection */}
              <div className="role-checkbox-group">
                {/* Chọn Customer */}
                <label className="custom-checkbox">
                  <input 
                    type="radio" 
                    name="role" 
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                  />
                  <span className="checkmark-box"></span>
                  Customer
                </label>

                {/* Chọn Staff */}
                <label className="custom-checkbox">
                  <input 
                    type="radio" 
                    name="role" 
                    checked={role === 'staff'}
                    onChange={() => setRole('staff')}
                  />
                  <span className="checkmark-box"></span>
                  Staff
                </label>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn-submit-login">
                Log in
              </button>

            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI:  Trắng trống --- */}
        <div className="login-empty-side"></div>

      </div>

      {/* 2. ẢNH TRÀN MÀN HÌNH BÊN PHẢI (Nằm lớp trên) */}
      <img src={imgLogin} alt="Resort Overlay" className="overlay-image" />
    
    </div>
  );
};

export default Login;