import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import imgLogin from '../assets/img-login.jpg'; 
import bgLogin from '../assets/bg-login.jpg'; 

const Login = () => {
  const navigate = useNavigate();

<<<<<<< HEAD
  const [role, setRole] = useState('customer');
=======
  // State quản lý form
  const [role, setRole] = useState('customer'); // Mặc định chọn Customer
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

<<<<<<< HEAD
  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), 
      });

      const data = await response.json();

      if (data.success) {
        // Save username, Booking and Review page will use it
        localStorage.setItem('username', username); 
        // Save full information
        localStorage.setItem('currentUser', JSON.stringify(data.data));

        alert("Login successfully!");

        // Link
        const userRole = data.data.Role; 
        if (userRole === 'TIEP-TAN') {
          navigate('/receptionist/'); 
        } 
        else {
          navigate('/customer/');
        }
      } 
      else {
        alert(data.message || 'Incorrect username or password!');
      }

    } catch (error) {
      console.error('Error when login:', error);
      alert('Login fail!');
    }
  };
=======
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
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c

  return (
    <div className="login-page-wrapper" style={{ backgroundImage: `url(${bgLogin})` }}>
      
      <div className="login-card-container">
        
<<<<<<< HEAD
        {/* Left column: Form login */}
=======
        {/* --- CỘT TRÁI: FORM LOGIN --- */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
        <div className="login-form-side">
          <div className="login-content-box">
            <h1 className="login-heading">LOG IN</h1>
            <p className="login-subtext">
              Welcome to Holybird resort,<br />
              Wish you have a memorable trip!
            </p>

            <form onSubmit={handleLogin}>
              
<<<<<<< HEAD
              {/* Username input */}
=======
              {/* Username Input */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
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

<<<<<<< HEAD
              {/* Password input */}
=======
              {/* Password Input */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
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

<<<<<<< HEAD
              {/* Checkbox role selection */}
              <div className="role-checkbox-group">
                {/* Select customer */}
=======
              {/* Checkbox Role Selection */}
              <div className="role-checkbox-group">
                {/* Chọn Customer */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
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

<<<<<<< HEAD
                {/* Select staff */}
=======
                {/* Chọn Staff */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
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

<<<<<<< HEAD
              {/* Login button */}
=======
              {/* Login Button */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
              <button type="submit" className="btn-submit-login">
                Log in
              </button>

            </form>
          </div>
        </div>

<<<<<<< HEAD
        {/* Right column - Empty page */}
=======
        {/* --- CỘT PHẢI:  Trắng trống --- */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
        <div className="login-empty-side"></div>

      </div>

<<<<<<< HEAD
      {/* Background in left side */}
=======
      {/* 2. ẢNH TRÀN MÀN HÌNH BÊN PHẢI (Nằm lớp trên) */}
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
      <img src={imgLogin} alt="Resort Overlay" className="overlay-image" />
    
    </div>
  );
};

export default Login;