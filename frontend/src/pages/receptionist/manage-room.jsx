import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import '../../App.css' 

const ManageRooms = () => {
  // --- STATE ---
  const [roomTypes, setRoomTypes] = useState([]) 
  const [rooms, setRooms] = useState([])         
  const [loading, setLoading] = useState(true)
  
  // State xử lý chỉnh sửa giá
  // editingTypeId dùng để xác định card nào đang mở input, nhưng khi lưu sẽ lấy tên hạng phòng
  const [editingTypeId, setEditingTypeId] = useState(null)
  const [tempPrice, setTempPrice] = useState(0)

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
        setLoading(true)
        
        // API 1: Lấy thống kê loại phòng (Card)
        const resTypes = await fetch('http://localhost:3000/api/receptionist/room-types')
        const dataTypes = await resTypes.json()

        // API 2: Lấy danh sách chi tiết phòng (Table)
        const resRooms = await fetch('http://localhost:3000/api/receptionist/rooms')
        const dataRooms = await resRooms.json()

        if (dataTypes.success) setRoomTypes(dataTypes.data)
        if (dataRooms.success) setRooms(dataRooms.data)

    } catch (error) {
        console.error("Error fetching data:", error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- HANDLERS ---
  const startEditing = (type) => {
      setEditingTypeId(type.MaLoai)
      setTempPrice(type.DonGia)
  }

  const cancelEditing = () => {
      setEditingTypeId(null)
      setTempPrice(0)
  }

  const saveNewPrice = async (maLoai) => {
      // 1. Tìm object phòng đang sửa để lấy đúng tên "TenHang" (HangPhong)
      const currentType = roomTypes.find(t => t.MaLoai === maLoai)
      
      if (!currentType) return

      // Validate giá trị
      if (parseInt(tempPrice) <= 0) {
          alert("Price must be greater than 0")
          return
      }

      try {
          const res = await fetch('http://localhost:3000/api/receptionist/update-price', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  hangPhong: currentType.TenHang, 
                  newPrice: parseInt(tempPrice) 
              })
          })
          const result = await res.json()

          if (result.success) {
              const updatedTypes = roomTypes.map(t => 
                  t.TenHang === currentType.TenHang ? { ...t, DonGia: parseInt(tempPrice) } : t
              )
              setRoomTypes(updatedTypes)
              setEditingTypeId(null)
              alert(result.message)
          } else {
              alert("Update failed: " + result.message)
          }
      } catch (err) {
          console.error(err)
          alert("Connection error to server")
      }
  }

  return (
    <div className="manage-room-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .manage-room-wrapper, button, input, h1, h2, h3, p, span, div { font-family: 'Poppins', sans-serif; }
        .manage-room-wrapper { background-color: #F5F5F0; min-height: 100vh; padding-bottom: 50px; }
        .mr-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }

        /* HEADER SECTION */
        .mr-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .mr-title h1 { font-size: 28px; font-weight: 700; color: #0B2341; margin: 0; }
        .mr-title p { font-size: 14px; color: #555; margin-top: 5px; }
        .btn-refresh { background: white; border: 1px solid #ccc; padding: 8px 15px; border-radius: 8px; cursor: pointer; color: #0B2341; font-weight: 600; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .btn-refresh:hover { background: #eee; }

        /* SECTION 1: ROOM TYPES CARDS */
        .types-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .type-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 5px solid #0B2341; transition: transform 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
        .type-card:hover { transform: translateY(-5px); }
        
        .tc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .tc-title { font-size: 18px; font-weight: 700; color: #0B2341; }
        .tc-subtitle { font-size: 13px; color: #777; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
        
        .tc-stats { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f9f9f9; padding: 12px; border-radius: 8px; }
        .stat-item { text-align: center; flex: 1; border-right: 1px solid #eee; }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-size: 18px; font-weight: 700; color: #0B2341; display: block; }
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; }
        .stat-item.available .stat-num { color: #28a745; }
        .stat-item.occupied .stat-num { color: #dc3545; }

        .price-section { display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed #eee; padding-top: 15px; margin-top: auto; }
        .current-price { font-size: 20px; font-weight: 700; color: #0B2341; }
        .price-input { width: 120px; padding: 6px 10px; border: 1px solid #0B2341; border-radius: 4px; font-weight: 600; color: #0B2341; outline: none; }
        
        .btn-edit-price { background: none; border: none; color: #0B2341; cursor: pointer; font-size: 14px; text-decoration: underline; font-weight: 500; }
        .action-group { display: flex; gap: 8px; }
        .btn-save { background: #28a745; color: white; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; }
        .btn-cancel { background: #dc3545; color: white; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; }

        /* SECTION 2: ROOM LIST TABLE */
        .room-list-section { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .section-heading { font-size: 20px; font-weight: 700; color: #0B2341; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        
        .r-table { width: 100%; border-collapse: collapse; }
        .r-table th { text-align: left; padding: 15px; background-color: #f1f1f1; color: #555; font-weight: 600; font-size: 14px; text-transform: uppercase; }
        .r-table td { padding: 15px; border-bottom: 1px solid #eee; color: #333; font-size: 14px; }
        .r-table tr:hover { background-color: #fafafa; }

        .text-center { text-align: center !important; }

        .status-badge { padding: 6px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; min-width: 100px; text-align: center; }
        .status-Rảnh { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status-Bận { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .status-Dọn { background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; }

        @media (max-width: 768px) {
            .types-grid { grid-template-columns: 1fr; }
            .r-table { display: block; overflow-x: auto; }
            .r-table th, .r-table td { padding: 10px; font-size: 13px; white-space: nowrap; }
        }
      `}</style>

      <Header isLoggedIn={true} useDarkTheme={true} role="receptionist" />

      <div className="mr-container">
        <div className="mr-header">
            <div className="mr-title">
                <h1>Manage Rooms</h1>
                <p>Overview of room availability, pricing, and status.</p>
            </div>
            <button className="btn-refresh" onClick={fetchData}>
                <i className="fa-solid fa-rotate-right"></i> Refresh
            </button>
        </div>

        {loading ? (
            <div style={{textAlign:'center', marginTop:'50px'}}>
                <i className="fa-solid fa-spinner fa-spin" style={{fontSize: '30px', color: '#0B2341'}}></i>
            </div>
        ) : (
            <>
                {/* --- 1. ROOM TYPES CARDS (UPDATE PRICE) --- */}
                <h2 style={{fontSize:'18px', color:'#0B2341', marginBottom:'15px', fontWeight:'600'}}>Room Categories & Pricing</h2>
                <div className="types-grid">
                    {roomTypes.map(type => (
                        <div className="type-card" key={type.MaLoai}>
                            <div className="tc-header">
                                <div>
                                    <div className="tc-title">{type.TenHang}</div>
                                    <div className="tc-subtitle">{type.LoaiGiuong} ({type.SoGiuong} Beds)</div>
                                    <div style={{fontSize:'11px', color:'#999', marginTop:'2px'}}>Code: {type.MaLoai}</div>
                                </div>
                                <i className="fa-solid fa-bed" style={{fontSize:'28px', color:'#eee'}}></i>
                            </div>

                            <div className="tc-stats">
                                <div className="stat-item">
                                    <span className="stat-num">{type.TongSoPhong}</span>
                                    <span className="stat-label">Total</span>
                                </div>
                                <div className="stat-item available">
                                    <span className="stat-num">{type.SoPhongTrong}</span>
                                    <span className="stat-label">Available</span>
                                </div>
                                <div className="stat-item occupied">
                                    <span className="stat-num">{type.TongSoPhong - type.SoPhongTrong}</span>
                                    <span className="stat-label">Occupied</span>
                                </div>
                            </div>

                            <div className="price-section">
                                {editingTypeId === type.MaLoai ? (
                                    <>
                                        <input 
                                            type="number" 
                                            className="price-input" 
                                            value={tempPrice} 
                                            onChange={(e) => setTempPrice(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="action-group">
                                            <button className="btn-save" onClick={() => saveNewPrice(type.MaLoai)}>Save</button>
                                            <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="current-price">
                                            ${type.DonGia?.toLocaleString()} <span style={{fontSize:'13px', fontWeight:'400', color:'#888'}}>/ night</span>
                                        </div>
                                        <button className="btn-edit-price" onClick={() => startEditing(type)}>
                                            <i className="fa-solid fa-pen-to-square"></i> Edit Price
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- 2. ROOM LIST TABLE --- */}
                <div className="room-list-section">
                    <div className="section-heading">
                        <i className="fa-solid fa-list-ul"></i> All Rooms List
                    </div>
                    <table className="r-table">
                        <thead>
                            <tr>
                                <th>Room ID</th>
                                <th>Class</th>
                                <th>Type</th>
                                <th className="text-center">Floor</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.MaPhong}>
                                    <td><strong>{room.MaPhong}</strong></td>
                                    <td>{room.TenHang}</td>
                                    <td>{room.LoaiGiuong} ({room.SoGiuong} beds)</td>
                                    <td className="text-center">{room.MaPhong.substring(1, 3)}</td> 
                                    <td className="text-center">
                                        <span className={`status-badge status-${room.TrangThai}`}>
                                            {room.TrangThai === 'Rảnh' ? 'Available' : 'Occupied'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}
      </div>
    </div>
  )
}

export default ManageRooms