import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import imgLogin from '../assets/img-login.jpg'; 
import bgLogin from '../assets/bg-login.jpg'; 

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div className="login-page-wrapper" style={{ backgroundImage: `url(${bgLogin})` }}>
      
      <div className="login-card-container">
        
        {/* Left column: Form login */}
        <div className="login-form-side">
          <div className="login-content-box">
            <h1 className="login-heading">LOG IN</h1>
            <p className="login-subtext">
              Welcome to Holybird resort,<br />
              Wish you have a memorable trip!
            </p>

            <form onSubmit={handleLogin}>
              
              {/* Username input */}
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

              {/* Password input */}
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

              {/* Checkbox role selection */}
              <div className="role-checkbox-group">
                {/* Select customer */}
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

                {/* Select staff */}
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

              {/* Login button */}
              <button type="submit" className="btn-submit-login">
                Log in
              </button>

            </form>
          </div>
        </div>

        {/* Right column - Empty page */}
        <div className="login-empty-side"></div>

      </div>

      {/* Background in left side */}
      <img src={imgLogin} alt="Resort Overlay" className="overlay-image" />
    
    </div>
  );
};

export default Login;