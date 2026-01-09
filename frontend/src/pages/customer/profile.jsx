import React from 'react';
import Header from '../../components/Header';
import '../../App.css'; // Reset CSS

const CustomerProfile = () => {

  // Dữ liệu giả lập giống hệt trong hình
  const members = [
    { id: 'KH01', name: 'Nguyễn Văn A', cccd: '080200010001', phone: '0778012341', dob: '10/12/2005', gender: 'Male' },
    { id: 'KH02', name: 'Nguyễn Văn B', cccd: '080200010002', phone: '0778012342', dob: '10/08/2005', gender: 'Male' },
    { id: 'KH03', name: 'Nguyễn Văn C', cccd: '080200010003', phone: '0778012343', dob: '23/08/2005', gender: 'Female' },
    { id: 'KH04', name: 'Nguyễn Văn D', cccd: '080200010004', phone: '0778012344', dob: '08/07/2005', gender: 'Female' },
    { id: 'KH05', name: 'Nguyễn Văn E', cccd: '080200010005', phone: '0778012345', dob: '08/12/2005', gender: 'Female' },
  ];

  return (
    <div className="profile-page-wrapper">
      {/* --- CSS NỘI BỘ --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        /* 1. Tổng quan trang */
        .profile-page-wrapper {
            background-color: #F5F5F0; /* Màu nền be nhạt đồng bộ */
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
            display: flex;
            flex-direction: column;
        }

        /* 2. Phần nội dung chính căn giữa */
        .profile-content {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: flex-start; /* Căn lên trên một chút thay vì giữa hẳn */
            padding: 60px 20px;
        }

        /* 3. Card chứa bảng thông tin */
        .profile-card {
            background-color: white;
            border-radius: 20px; /* Bo góc lớn giống hình */
            padding: 40px 50px;
            width: 100%;
            max-width: 1100px; /* Độ rộng tối đa */
            box-shadow: 0 5px 20px rgba(0,0,0,0.03); /* Bóng mờ rất nhẹ */
            overflow-x: auto; /* Để không vỡ trên mobile */
        }

        /* 4. Table Styles */
        .profile-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px; /* Đảm bảo bảng không bị co quá nhỏ */
        }

        /* Header Row (Id, Name, CCCD...) */
        .profile-table thead th {
            text-align: left;
            font-size: 18px;
            font-weight: 700; /* In đậm */
            color: #000;
            padding-bottom: 30px; /* Khoảng cách với hàng dữ liệu đầu tiên */
            white-space: nowrap;
        }

        /* Data Rows */
        .profile-table tbody td {
            font-size: 16px;
            font-weight: 400;
            color: #111;
            padding: 20px 0; /* Khoảng cách dọc giữa các dòng */
            border-bottom: 1px solid transparent; /* Giữ layout ổn định */
        }

        /* Căn chỉnh khoảng cách các cột cho giống hình */
        .col-id { width: 10%; }
        .col-name { width: 20%; }
        .col-cccd { width: 20%; }
        .col-phone { width: 15%; }
        .col-dob { width: 15%; }
        .col-gender { width: 10%; }

        /* Responsive: Khi màn hình nhỏ */
        @media (max-width: 768px) {
            .profile-card {
                padding: 20px;
            }
            .profile-table thead th {
                font-size: 16px;
            }
            .profile-table tbody td {
                font-size: 14px;
                padding: 15px 0;
            }
        }
      `}</style>

      {/* Header cho Customer */}
      <Header isLoggedIn={true} useDarkTheme={true} />

      <div className="profile-content">
        <div className="profile-card">
            <table className="profile-table">
                <thead>
                    <tr>
                        <th className="col-id">Id</th>
                        <th className="col-name">Name</th>
                        <th className="col-cccd">CCCD</th>
                        <th className="col-phone">Phone</th>
                        <th className="col-dob">Day of Birth</th>
                        <th className="col-gender">Gender</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={index}>
                            <td>{member.id}</td>
                            <td>{member.name}</td>
                            <td>{member.cccd}</td>
                            <td>{member.phone}</td>
                            <td>{member.dob}</td>
                            <td>{member.gender}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;