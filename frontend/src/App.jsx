import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SharedHome from './pages/share-home'; // Trang chủ chung
import CustomerHome from './pages/customer/home'; // Trang chủ Customer
import ReceptionistHome from './pages/receptionist/home'; // Trang chủ Receptionist
import Login from './pages/login'; // Trang Login
import ReceptionistCreateAccount from './pages/receptionist/create-account';

function App() {
  return (
      <Routes>
        {/* Mặc định vào "/" thì chuyển hướng về "/home" */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 1. KHÁCH VÃNG LAI (Không có role -> Hiện nút Login) */}
        <Route path="/home" element={<SharedHome />} />

        {/* 2. CUSTOMER (Có role="customer") */}
        <Route path="/customer/" element={<CustomerHome />} />

        {/* 3. RECEPTIONIST (Có role="receptionist") */}
        <Route path="/receptionist/" element={<ReceptionistHome />} />
    
        {/* Trang Đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Trang Tạo tài khoản cho Receptionist */}
        <Route path="/receptionist/create-account" element={<ReceptionistCreateAccount />} />

      </Routes>
  );
}

export default App;