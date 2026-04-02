const express = require('express');
const cors = require('cors');
const { connectDB, sql } = require('./src/config/db'); 

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Function to call Stored Procedure
async function executeSP(spName, params) {
    try {
        const pool = await connectDB();
        const request = pool.request();
        
        if (params) {
            for (const key in params) {
                request.input(key, params[key]);
            }
        }
        
        const result = await request.execute(spName);
        return result.recordset; 
    } catch (err) {
        console.error(`❌ Error when call ${spName}:`, err);
        throw err;
    }
}

// Api login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(`🔹 Processing login: ${username}`)

        const result = await executeSP('sp_DangNhap', { 
            TenDangNhap: username, 
            MatKhau: password 
        })

        const user = result[0]
        if (user && user.Role !== 'ERROR') {
            res.json({ success: true, data: user })
        }
        else {
            res.status(401).json({ success: false, message: 'Incorrect username or password' })
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Api create accout for group guests
app.post('/api/create-visitor', async (req, res) => {
    try {
        console.log("🔹 Receiving request create transaction...");
        
        // Get data from front end
        const { representative, cccd, members, startDate, endDate } = req.body;
        console.log("   - Group name:", representative);

        // Generate user/pass at back-end (for avoid duplicate)
        const randomNum = Math.floor(1000 + Math.random() * 9000); 
        const username = `RES${randomNum}`; 
        const password = Math.random().toString(36).slice(-8).toUpperCase(); 

        // Connect SQL and save
        const pool = await connectDB(); 
        await pool.request()
            .input('HoTenDaiDien', sql.NVarChar, representative)
            .input('CCCD', sql.VarChar, cccd)
            .input('TenDangNhap', sql.VarChar, username)
            .input('MatKhau', sql.VarChar, password)
            .input('SoNguoi', sql.Int, parseInt(members))
            .input('NgayDen', sql.Date, new Date(startDate))
            .input('NgayDi', sql.Date, new Date(endDate))
            .execute('sp_TaoTaiKhoanDoan'); 

        console.log(`✅ Create successfully! User: ${username} - Pass: ${password}`);

        // Return user/pass to front-end
        res.json({ success: true, username, password });

    } catch (err) {
        console.error("🔥 Error when save database:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// API Tìm kiếm phòng
app.post('/api/search-rooms', async (req, res) => {
    try {
        const { roomClass, bedType, bedQuantity, isInitialLoad } = req.body;

        console.log(`🔎 Request finding rooms. Initial Load: ${isInitialLoad}`);

        const pool = await connectDB();
        const request = pool.request();

        if (isInitialLoad) {
            request.input('HangPhong', sql.NVarChar(10), null);
            request.input('LoaiGiuong', sql.NVarChar(3), null);
            request.input('SoGiuong', sql.Int, null);
            request.input('ChiHienPhongTrong', sql.Bit, 0); 
        } else {
            const classMap = {
                'Standard': 'Standard', 
                'Deluxe': 'Deluxe',
                'VIP': 'VIP'
            };
            const dbClass = classMap[roomClass] || null;
            
            const bedTypeMap = { 'Single': 'Đơn', 'Double': 'Đôi' };
            const dbBedType = bedTypeMap[bedType] || null;

            request.input('HangPhong', sql.NVarChar(10), dbClass);
            request.input('LoaiGiuong', sql.NVarChar(3), dbBedType);
            request.input('SoGiuong', sql.Int, parseInt(bedQuantity));
            request.input('ChiHienPhongTrong', sql.Bit, 1); 
        }
        
        const result = await request.execute('sp_XemDanhSachPhong');
        
        const rooms = result.recordset; 

        console.log(`✅ Found ${rooms.length} rooms.`);
        res.json({ success: true, data: rooms });

    } catch (err) {
        console.error("🔥 Error search-rooms:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Api booking (Make by receptionist)
app.post('/api/receptionist/booking', async (req, res) => {
    try {
        console.log("🔹 Booking:", req.body);

        const result = await executeSP('sp_DatPhong', {
            MaGiaoDich: req.body.maGiaoDich,
            MaPhong: req.body.maPhong,
            NgayNhan: req.body.ngayNhan,
            NgayTra: req.body.ngayTra
        });

        const output = result[0];
        if (output && output.KetQua === 1) {
            res.json({ success: true, message: output.ThongBao });
        } else {
            res.status(400).json({ success: false, message: output ? output.Loi : "Error" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Api booking (make by customer)
app.post('/api/customer/booking-new', async (req, res) => {
    try {
        const { username, roomId, checkIn, checkOut } = req.body;
        
        const pool = await connectDB();
        const result = await pool.request()
            .input('TenDangNhap', sql.VarChar, username)
            .input('MaPhong', sql.VarChar, roomId)
            .input('NgayDen', sql.Date, new Date(checkIn))
            .input('NgayDi', sql.Date, new Date(checkOut))
            .execute('sp_DatPhongMoi');

        const output = result.recordset[0];

        if (output && output.KetQua === 1) {
            res.json({ success: true, message: output.ThongBao });
        } else {
            res.status(400).json({ success: false, message: output ? output.ThongBao : "Undefine error" });
        }

    } catch (err) {
        console.error("Error when booking:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Api view my bookings
app.get('/api/my-bookings', async (req, res) => {
    try {
        const { username } = req.query;
        console.log(`book review cho user: ${username}`);
        
        const pool = await connectDB();
        const result = await pool.request()
            .input('TenDangNhap', sql.VarChar, username)
            .execute('sp_LayDanhSachPhongDaDat');

        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await connectDB();
        const result = await pool.request()
            .input('MaPhong', sql.Char(5), id)
            .execute('sp_TraCuuPhong');

        if (result.recordset.length > 0) {
            res.json({ success: true, data: result.recordset[0] });
        } 
        else {
            res.status(404).json({ success: false, message: 'Room not found' });
        }
    } 
    catch (err) {
        console.error("Error fetching room detail:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT MaGiaoDich, TenDangNhap, BatDau, KetThuc, TrangThai 
            FROM GIAODICH 
            WHERE TrangThai = N'Đang diễn ra'
        `);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/booking/:id/members', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await connectDB();
        const result = await pool.request()
            .input('MaGiaoDich', sql.Char(5), id)
            .query(`
                SELECT KH.MaKhachHang, KH.HoTen, KH.CMND, KH.SoDienThoai, KH.NgaySinh, KH.GioiTinh
                FROM KHACHHANG KH
                JOIN KHACHHANG_GIAODICH KHGD ON KH.MaKhachHang = KHGD.MaKhachHang
                WHERE KHGD.MaGiaoDich = @MaGiaoDich
            `);
        
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/booking/book-room', async (req, res) => {
    const { roomId, transactionId, members } = req.body; 

    if (!roomId || !transactionId || !members || members.length === 0) {
        return res.status(400).json({ success: false, message: 'Lack infomation for booking' });
    }

    try {
        const pool = await connectDB();
        const listMaKhachHang = members.map(m => m.id).join('-');

        console.log(`🚀 Booking room ${roomId} for group: ${listMaKhachHang}`);

        const request = pool.request();
        request.input('MaPhong', sql.Char(5), roomId);
        request.input('MaGiaoDich', sql.Char(5), transactionId);
        request.input('ListMaKhachHang', sql.VarChar(sql.MAX), listMaKhachHang);

        await request.execute('sp_DatPhong');

        console.log(`✅ Successfully booking!`);
        
        res.json({ 
            success: true, 
            message: 'Successfully booking!' 
        });

    } catch (err) {
        console.error("🔥 Error when booking:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/receptionist/bookings', async (req, res) => {
    try {
        const pool = await connectDB();
        
        const result = await pool.request().query(`
            SELECT 
                GD.MaGiaoDich,
                KH.HoTen AS RepName,
                KH.CMND AS RepCCCD,
                CT.MaPhong,
                CT.MaCTGD,
                CT.BatDau,
                CT.KetThuc,
                CT.DonGia,
                HP.TenHang,      
                HTP.LoaiGiuong,  
                HTP.SoGiuong,
                TT.MaThanhToan
            FROM GIAODICH GD
            JOIN KHACHHANG KH ON GD.DaiDien = KH.MaKhachHang
            JOIN CHITIETGIAODICH CT ON GD.MaGiaoDich = CT.MaGiaoDich
            JOIN PHONG P ON CT.MaPhong = P.MaPhong
            JOIN LOAIPHONG LP ON P.MaLoai = LP.MaLoai
            JOIN HANGPHONG HP ON HP.MaHang = LP.MaHang
            JOIN HINHTHUCPHONG HTP ON LP.MaHinhThuc = HTP.MaHinhThuc
            LEFT JOIN THANHTOAN TT ON GD.MaGiaoDich = TT.MaGiaoDich
            ORDER BY GD.MaGiaoDich DESC
        `);

        const rawData = result.recordset;

        const groupsMap = new Map();

        rawData.forEach(row => {
            if (!groupsMap.has(row.MaGiaoDich)) {
                groupsMap.set(row.MaGiaoDich, {
                    groupId: row.MaGiaoDich,
                    repName: row.RepName,
                    repCCCD: row.RepCCCD,
                    isPaid: row.MaThanhToan,
                    roomsMap: new Map()
                });
            }

            const group = groupsMap.get(row.MaGiaoDich);

            let status = 'pending';
            if (row.BatDau && !row.KetThuc) status = 'checked-in';
            if (row.KetThuc) status = 'checked-out';

            if (!group.roomsMap.has(row.MaPhong)) {
                group.roomsMap.set(row.MaPhong, {
                    id: row.MaCTGD,
                    name: row.MaPhong,
                    rating: '5.0',
                    tags: [row.TenHang, `${row.SoGiuong} ${row.LoaiGiuong}`],
                    checkIn: row.BatDau,
                    checkOut: row.KetThuc,
                    nights: 1,
                    totalPrice: row.DonGia,
                    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300&auto=format&fit=crop', // Mock ảnh
                    status: status,
                    maGiaoDich: row.MaGiaoDich,
                    maPhong: row.MaPhong
                });
            }
        });

        const finalGroups = Array.from(groupsMap.values()).map(g => ({
            ...g,
            rooms: Array.from(g.roomsMap.values())
        }));

        res.json({ success: true, data: finalGroups });

    } catch (err) {
        console.error("Error fetching receptionist bookings:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/receptionist/check-in', async (req, res) => {
    const { maPhong, maGiaoDich } = req.body;
    try {
        const pool = await connectDB();
        await pool.request()
            .input('MaPhong', sql.Char(5), maPhong)
            .input('MaGiaoDich', sql.Char(5), maGiaoDich)
            .execute('sp_NhanPhong');
        
        res.json({ success: true, message: 'Check-in successfully!' });
    } catch (err) {
        console.error("Check-in Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/receptionist/check-out', async (req, res) => {
    const { maPhong, maCTGD, maGiaoDich } = req.body;
    try {
        const pool = await connectDB();
        await pool.request()
            .input('MaPhong', sql.Char(5), maPhong)
            .input('MaGiaoDich', sql.Char(5), maGiaoDich)
            .execute('sp_TraPhong');
        
        res.json({ success: true, message: 'Check-out successfully!' });
    } catch (err) {
        console.error("Check-out Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/receptionist/cancel', async (req, res) => {
    const { maPhong, maGiaoDich } = req.body;
    try {
        const pool = await connectDB();
        await pool.request()
            .input('MaPhong', sql.Char(5), maPhong)
            .input('MaGiaoDich', sql.Char(5), maGiaoDich)
            .execute('sp_HuyDatPhong');
        
        res.json({ success: true, message: 'Cancel booking successfully!' });
    } catch (err) {
        console.error("Cancel Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/receptionist/payment', async (req, res) => {
    const { maGiaoDich, paymentMethods } = req.body;

    if (!maGiaoDich || !paymentMethods || paymentMethods.length === 0) {
        return res.status(400).json({ success: false, message: 'Lack payment information' });
    }

    let hinhThucList = [];
    paymentMethods.forEach(pm => {
        if (pm.amount > 0) {
            if (pm.method === 'cash') hinhThucList.push('Tiền mặt');
            else if (pm.method === 'credit' || pm.method === 'checking') hinhThucList.push('Chuyển khoản');
        }
    });
    
    const hinhThucFinal = hinhThucList[0] || 'Tiền mặt'; 
    
    console.log(`💸 Start process payment for transaction: ${maGiaoDich} - Type: ${hinhThucFinal}`);

    try {
        const pool = await connectDB();
        const request = pool.request();
        
        request.input('MaGiaoDich', sql.Char(5), maGiaoDich);
        request.input('HinhThucThanhToan', sql.NVarChar(20), hinhThucFinal);

        const result = await request.execute('sp_ThanhToan');
        const data = result.recordset[0]; 

        if (data && data.Success) {
            
            if (data.SoTienXacNhan !== data.SoTienInBill) {
                
                const compItems = await pool.request()
                    .input('MaGD', sql.Char(5), maGiaoDich)
                    .query("SELECT * FROM BOITHUONG WHERE MaGiaoDich = @MaGD");

                return res.json({
                    success: true,
                    warning: true,
                    message: `Data changed! [${data.SoTienXacNhan} -> ${data.SoTienInBill}]`,
                    data: data,
                    compensationList: compItems.recordset
                });
            }

            res.json({ 
                success: true, 
                message: 'Successfully payment!',
                data: data 
            });
        }

    } catch (err) {
        console.error("🔥 Payment error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/receptionist/room-types', async (req, res) => {
    try {
        const pool = await connectDB()
        const result = await pool.request().query(`
            SELECT 
                lp.MaLoai,
                lp.DonGia,
                lp.SoPhongTrong,
                hp.TenHang,
                htp.LoaiGiuong,
                htp.SoGiuong,
                (SELECT COUNT(*) FROM PHONG p WHERE p.MaLoai = lp.MaLoai) AS TongSoPhong
            FROM LOAIPHONG lp
            JOIN HANGPHONG hp ON lp.MaHang = hp.MaHang
            JOIN HINHTHUCPHONG htp ON lp.MaHinhThuc = htp.MaHinhThuc
            ORDER BY lp.MaLoai
        `)
        res.json({ success: true, data: result.recordset })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

app.get('/api/receptionist/rooms', async (req, res) => {
    try {
        const pool = await connectDB()
        const result = await pool.request().query(`
            SELECT 
                p.MaPhong,
                p.TrangThai,
                hp.TenHang,
                htp.LoaiGiuong,
                htp.SoGiuong
            FROM PHONG p
            JOIN LOAIPHONG lp ON p.MaLoai = lp.MaLoai
            JOIN HANGPHONG hp ON lp.MaHang = hp.MaHang
            JOIN HINHTHUCPHONG htp ON lp.MaHinhThuc = htp.MaHinhThuc
            ORDER BY p.MaPhong
        `)
        res.json({ success: true, data: result.recordset })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

app.put('/api/receptionist/update-price', async (req, res) => {
    const { hangPhong, newPrice } = req.body

    if (!hangPhong || !newPrice) {
        return res.status(400).json({ success: false, message: 'Lack information for update' })
    }

    try {
        const pool = await connectDB()
        const request = pool.request()

        request.input('HangPhong', sql.NVarChar(50), hangPhong)
        request.input('DonGiaMoi', sql.Int, newPrice)

        const result = await request.execute('sp_CapNhatGiaPhong')

        if (result.recordset && result.recordset.length > 0) {
            res.json({ success: true, message: result.recordset[0].Message })
        } 
        else {
            res.json({ success: true, message: 'Update successfully!' })
        }

    } 
    catch (err) {
        console.error("Update Price Error:", err)
        res.status(500).json({ success: false, message: err.message })
    }
})

// API: Ghi nhận bồi thường (Gọi SP sp_GhiNhanBoiThuong)
app.post('/api/receptionist/add-compensation', async (req, res) => {
    const { tenThietBi, maPhong, maGiaoDich, soLuong, tienBoiThuong } = req.body;

    // Validate
    if (!tenThietBi || !maPhong || !maGiaoDich || !tienBoiThuong) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin bồi thường' });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        // Input khớp với Stored Procedure
        request.input('TenThietBi', sql.NVarChar(30), tenThietBi);
        request.input('MaPhong', sql.Char(5), maPhong);
        request.input('MaGiaoDich', sql.Char(5), maGiaoDich);
        request.input('SoLuong', sql.Int, parseInt(soLuong));
        request.input('TienBoiThuong', sql.Int, parseInt(tienBoiThuong));

        await request.execute('sp_GhiNhanBoiThuong');

        res.json({ success: true, message: 'Ghi nhận bồi thường thành công!' });

    } catch (err) {
        console.error("Compensation Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
})

app.get('/api/lookup-room/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await connectDB();
        const result = await pool.request()
            .input('MaPhong', sql.Char(5), id) 
            .execute('sp_TraCuuPhong');

        if (result.recordset.length > 0) {
            res.json({ success: true, data: result.recordset[0] });
        } 
        else {
            res.json({ success: false, message: 'Room not found' });
        }
    } 
    catch (err) {
        console.error("Lookup Room Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend is running at http://localhost:${PORT}`);
});