<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
import { Routes, Route, Navigate } from 'react-router-dom';
import SharedHome from './pages/share-home'; // Trang chủ chung
import CustomerHome from './pages/customer/home'; // Trang chủ Customer
import ReceptionistHome from './pages/receptionist/home'; // Trang chủ Receptionist
import Login from './pages/login'; // Trang Login
import ReceptionistCreateAccount from './pages/receptionist/create-account';
import CustomerProfile from './pages/customer/profile';
import BookingSearch from './pages/customer/booking';
import BookingDetail from './pages/customer/booking-detail';
import ReviewBooking from './pages/customer/review-booking';
import ReceptionistReviewBooking from './pages/receptionist/review-booking';
import PaymentPage from './pages/receptionist/payment';
<<<<<<< HEAD
import ManageRoomsPage from './pages/receptionist/manage-room';
=======
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c

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

        {/* Route cho trang Profile của Customer */}
        <Route path="/customer/profile" element={<CustomerProfile />} />

        {/* Route cho trang Tra cứu phòng */}
        <Route path="/booking" element={<BookingSearch />} />

        {/* Route trang chi tiết phòng */}
        <Route path="/booking/detail" element={<BookingDetail />} />

        {/* Route trang xem lại đặt phòng */}
        <Route path="/customer/review" element={<ReviewBooking />} />
        
        {/* Route cho Receptionist xem danh sách phòng */}
        <Route path="/receptionist/review" element={<ReceptionistReviewBooking />} />
        <Route path="/receptionist/payment" element={<PaymentPage />} />
<<<<<<< HEAD
        <Route path="/receptionist/manage-rooms" element={<ManageRoomsPage />} />
=======
>>>>>>> be26946a18b8aeb9b279984a2e73e63480210b0c
      </Routes>
  );
}

export default App;
