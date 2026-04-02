import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../App.css'

const PaymentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [viewState, setViewState] = useState('payment') 
  const [isProcessing, setIsProcessing] = useState(false) 

  const mockBookingInfo = {
    id: "SP228756",
    customerName: "Unknown Customer",
    guests: "2 adults",
    checkIn: "01/01/2025",
    checkOut: "02/01/2025",
    processor: "Receptionist",
    processTime: new Date().toLocaleString('en-GB'),
    items: [],
    subtotal: 0, promotion: 0, tax: 0, total: 0
  }

  const [bookingInfo, setBookingInfo] = useState(mockBookingInfo)
  const [paymentMode, setPaymentMode] = useState('partial') 
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, method: 'cash', amount: 0 },
    { id: 2, method: 'credit', amount: 0 }
  ])

  const [isConfirmed, setIsConfirmed] = useState(false)
  const [printReceipt, setPrintReceipt] = useState(false)
  const [showAddChargeModal, setShowAddChargeModal] = useState(false)
  
  const brokenItemsList = [
    { id: 'bi1', name: 'Bath Towel - Heavily Stained', price: 12 },
    { id: 'bi2', name: 'Glass Cup - Broken', price: 5 },
    { id: 'bi3', name: 'Bed Sheet - Torn', price: 25 },
    { id: 'bi4', name: '32-inch Smart TV - Cracked Screen', price: 450 },
  ]
  const [selectedBrokenItem, setSelectedBrokenItem] = useState(brokenItemsList[0].id)
  const [brokenItemQty, setBrokenItemQty] = useState(1)

  useEffect(() => {
    if (location.state) {
        setBookingInfo(location.state)
    }
  }, [location.state])

  useEffect(() => {
    if (bookingInfo.total) {
        if (paymentMode === 'full') {
            setPaymentMethods([
                { id: 1, method: 'cash', amount: bookingInfo.total },
                { id: 2, method: 'credit', amount: 0 }
            ])
        } else {
            setPaymentMethods([
                { id: 1, method: 'cash', amount: bookingInfo.total },
                { id: 2, method: 'credit', amount: 0 }
            ])
        }
    }
  }, [bookingInfo.total, paymentMode])

  const handleMethodChange = (index, newMethod) => {
    const updatedMethods = [...paymentMethods]
    updatedMethods[index].method = newMethod
    setPaymentMethods(updatedMethods)
  }

  const handleAmountChange = (index, newValue) => {
    if (paymentMode === 'full') return 

    let val = parseFloat(newValue)
    if (isNaN(val)) val = 0 
    if (val < 0) val = 0
    if (val > bookingInfo.total) {
        val = bookingInfo.total
    }

    const updatedMethods = [...paymentMethods]
    updatedMethods[index].amount = val

    const otherIndex = index === 0 ? 1 : 0
    const remaining = bookingInfo.total - val
    
    updatedMethods[otherIndex].amount = parseFloat(remaining.toFixed(2))

    setPaymentMethods(updatedMethods)
  }

  const handleAddCharge = () => {
    const itemToAdd = brokenItemsList.find(i => i.id === selectedBrokenItem)
    if (!itemToAdd) return
    const newItem = {
        no: bookingInfo.items.length + 1,
        desc: `${itemToAdd.name} (Compensation Fee)`,
        qty: parseInt(brokenItemQty),
        price: itemToAdd.price,
        amount: itemToAdd.price * parseInt(brokenItemQty)
    }
    const newItems = [...bookingInfo.items, newItem]
    const newSubtotal = newItems.reduce((acc, item) => acc + item.amount, 0)
    const newTax = (newSubtotal + bookingInfo.promotion) * 0.1
    const newTotal = newSubtotal + bookingInfo.promotion + newTax

    setBookingInfo({ 
        ...bookingInfo, 
        items: newItems, 
        subtotal: parseFloat(newSubtotal.toFixed(2)), 
        tax: parseFloat(newTax.toFixed(2)), 
        total: parseFloat(newTotal.toFixed(2)) 
    })
    setShowAddChargeModal(false)
  }

  const handleProcessPayment = async () => {
      setIsProcessing(true)

      try {
          const payload = {
              maGiaoDich: bookingInfo.id,
              paymentMethods: paymentMethods
          }

          const res = await fetch('http://localhost:3000/api/receptionist/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          })

          const result = await res.json()

          if (result.success) {
              const serverData = result.data;

              if (serverData.SoTienInBill !== serverData.SoTienXacNhan) {
                  const diff = serverData.SoTienInBill - serverData.SoTienXacNhan;
                  
                  alert(`⚠️ DATA CHANGED DETECTED!\n\nConfirm Amount: $${serverData.SoTienXacNhan}\nBill Amount: $${serverData.SoTienInBill}\n\nCompensation records were added during processing.`);

                  let newItems = [...bookingInfo.items];
                  
                  if (result.compensationList && result.compensationList.length > 0) {
                      const compItems = result.compensationList.map((comp, index) => ({
                          no: bookingInfo.items.length + index + 1,
                          desc: `${comp.TenThietBi} (Compensation)`,
                          qty: comp.SoLuong,
                          price: comp.TienBoiThuong / comp.SoLuong,
                          amount: comp.TienBoiThuong
                      }));
                      
                      newItems = [...newItems, ...compItems];
                  } else {
                      newItems.push({
                          no: bookingInfo.items.length + 1,
                          desc: 'Extra Compensation (System update)',
                          qty: 1,
                          price: diff,
                          amount: diff
                      });
                  }

                  setBookingInfo(prev => ({
                      ...prev,
                      items: newItems,
                      total: serverData.SoTienInBill, 
                      subtotal: prev.subtotal + diff 
                  }));
              }
              
              if (printReceipt) {
                  setViewState('receipt')
              } else {
                  setViewState('success')
              }
          } else {
              alert("Payment Failed: " + result.message)
          }

      } catch (error) {
          console.error("Payment error:", error)
          alert("Connection error to server")
      } finally {
          setIsProcessing(false)
      }
  }

  const renderPaymentForm = () => (
    <div className="payment-body">
            <div className="pb-left-col">
                <div className="booking-meta">
                    <span><strong>Total Guests:</strong> {bookingInfo.guests}</span>
                    <div className="dates">
                        <span><strong>Check-in:</strong> {bookingInfo.checkIn ? new Date(bookingInfo.checkIn).toLocaleDateString('en-GB') : 'N/A'}</span>
                        <span><strong>Check-out:</strong> {bookingInfo.checkOut ? new Date(bookingInfo.checkOut).toLocaleDateString('en-GB') : 'N/A'}</span>
                    </div>
                </div>

                <table className="payment-table">
                    <thead>
                        <tr>
                            <th style={{width: '50px'}}>No.</th>
                            <th style={{textAlign: 'left'}}>Description</th>
                            <th style={{width: '60px'}}>Qty</th>
                            <th style={{width: '90px'}}>Unit Price</th>
                            <th style={{width: '90px'}}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingInfo.items?.map((item, index) => (
                            <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{item.desc}</td>
                                <td className="text-center">{item.qty}</td>
                                <td className="text-center">${item.price}</td>
                                <td className="text-center"><strong>${item.amount}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="add-charge-container">
                    <button className="btn-add-charge" onClick={() => setShowAddChargeModal(true)}>Add Extra Charge</button>
                </div>
            </div>

            <div className="pb-right-col">
                <div className="summary-section">
                    <div className="summary-row"><span>Subtotal:</span><span>${bookingInfo.subtotal}</span></div>
                    <div className="summary-row">
                        <span>Promotion: <span className="promo-code">Voucher</span></span>
                        <span className="text-red">-${Math.abs(bookingInfo.promotion)}</span>
                    </div>
                    <div className="summary-row"><span>Tax (10%):</span><span>${bookingInfo.tax}</span></div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total-row"><span>TOTAL:</span><span>${bookingInfo.total}</span></div>
                </div>

                <div className="payment-methods-form">
                    <div className="pm-header">
                        <span>Payment method:</span>
                        <div className="mode-toggle">
                            <label className={`mode-option ${paymentMode === 'partial' ? 'selected' : ''}`}>
                                <input type="radio" name="mode" checked={paymentMode === 'partial'} onChange={() => setPaymentMode('partial')} /> Partial
                            </label>
                            <label className={`mode-option ${paymentMode === 'full' ? 'selected' : ''}`}>
                                <input type="radio" name="mode" checked={paymentMode === 'full'} onChange={() => setPaymentMode('full')} /> Full
                            </label>
                        </div>
                    </div>

                    <div className="pm-row">
                        <span className="pm-index">1.</span>
                        <div className="pm-options">
                            {['cash', 'credit', 'checking'].map(m => (
                                <label key={m} className={`pm-radio ${paymentMethods[0].method === m ? 'active' : ''}`}>
                                    <input type="radio" checked={paymentMethods[0].method === m} onChange={() => handleMethodChange(0, m)} />
                                    <span className="checkmark"></span> {m === 'credit' ? 'Credit card' : m.charAt(0).toUpperCase() + m.slice(1)}
                                </label>
                            ))}
                        </div>
                        <div className="pm-amount">
                            <span>$</span>
                            <input 
                                type="number" 
                                value={paymentMethods[0].amount} 
                                onChange={(e) => handleAmountChange(0, e.target.value)}
                                disabled={paymentMode === 'full'} 
                            />
                        </div>
                    </div>

                    {paymentMode === 'partial' && (
                        <div className="pm-row">
                            <span className="pm-index">2.</span>
                            <div className="pm-options">
                                {['cash', 'credit', 'checking'].map(m => (
                                    <label key={m} className={`pm-radio ${paymentMethods[1].method === m ? 'active' : ''}`}>
                                        <input type="radio" checked={paymentMethods[1].method === m} onChange={() => handleMethodChange(1, m)} />
                                        <span className="checkmark"></span> {m === 'credit' ? 'Credit card' : m.charAt(0).toUpperCase() + m.slice(1)}
                                    </label>
                                ))}
                            </div>
                            <div className="pm-amount">
                                <span>$</span>
                                <input 
                                    type="number" 
                                    value={paymentMethods[1].amount} 
                                    onChange={(e) => handleAmountChange(1, e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="change-due-row">
                        <span>Change Due:</span>
                        <span>0</span>
                    </div>

                    <div className="confirm-action">
                        {!isConfirmed ? (
                             <button className="btn-confirm-red" onClick={() => setIsConfirmed(true)}>Confirm Payment</button>
                        ) : (
                            <span style={{color:'green', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px', marginTop:'10px'}}>
                                <i className="fa-solid fa-check"></i> Confirmed
                            </span>
                        )}
                    </div>
                </div>

                <div className="payment-footer-actions">
                    <label className="print-receipt-check">
                        <input type="checkbox" checked={printReceipt} onChange={() => setPrintReceipt(!printReceipt)} />
                        Print Receipt
                    </label>

                    <div className="action-buttons">
                        <button className="btn-save-draft"><i className="fa-solid fa-print"></i> Save Draft</button>
                        <button 
                            className={`btn-process ${isConfirmed ? 'active' : 'disabled'}`}
                            disabled={!isConfirmed || isProcessing}
                            onClick={handleProcessPayment}
                            style={{ opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                        >
                            {isProcessing ? (
                                <span><i className="fa-solid fa-spinner fa-spin"></i> Processing...</span>
                            ) : (
                                <span><i className="fa-solid fa-sack-dollar"></i> Process Payment</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
    </div>
  )

  const renderSuccessView = () => (
      <div className="success-view-container">
          <div className="sv-header">
              <div className="sv-left">
                  <h2 className="sv-title">Booking details</h2>
                  <div className="sv-row"><span>Check - in</span> <span>{bookingInfo.checkIn ? new Date(bookingInfo.checkIn).toLocaleDateString('en-GB') : ''}</span></div>
                  <div className="sv-row"><span>Check - out</span> <span>{bookingInfo.checkOut ? new Date(bookingInfo.checkOut).toLocaleDateString('en-GB') : ''}</span></div>
                  <div className="sv-row"><span>Guest</span> <span>{bookingInfo.guests}</span></div>
              </div>
              <div className="sv-right">
                  <h2 className="sv-title" style={{textTransform:'uppercase', fontSize:'24px'}}>PAYMENT SUCCESSFUL</h2>
                  <div className="sv-row"><span>Booked by :</span> <span>{bookingInfo.customerName}</span></div>
                  <div className="sv-row"><span>Booking Date:</span> <span>{bookingInfo.processTime}</span></div>
              </div>
          </div>
          <table className="sv-table">
              <thead>
                  <tr>
                      <th>Quantity</th>
                      <th>Discription</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                  </tr>
              </thead>
              <tbody>
                  {bookingInfo.items?.map((item, idx) => (
                      <tr key={idx}>
                          <td>{item.qty} {item.qty > 1 ? 'Items' : 'Item'}</td>
                          <td>{item.desc}</td>
                          <td>${item.price}</td>
                          <td>${item.amount}</td>
                      </tr>
                  ))}
                  <tr className="sv-summary-row">
                      <td colSpan="2"></td>
                      <td><strong>Subtotal</strong><br/><strong>Tax</strong></td>
                      <td><strong>${bookingInfo.subtotal}</strong><br/><strong>${bookingInfo.tax}</strong></td>
                  </tr>
                  <tr className="sv-total-row">
                      <td colSpan="2"></td>
                      <td><strong>Total</strong></td>
                      <td><strong>${bookingInfo.total}</strong></td>
                  </tr>
              </tbody>
          </table>
          <div className="sv-footer">
              <h3>THANK YOU FOR STAYING</h3>
              <button className="btn-back-home" onClick={() => navigate('/receptionist/review')}>Back to Review</button>
          </div>
      </div>
  )

  const renderReceiptView = () => (
      <div className="receipt-view-wrapper">
          <div className="receipt-paper">
              <div className="receipt-header">
                  <h3>Holy Bird Resort</h3>
                  <h1 className="r-title">RECEIPT</h1>
                  <p className="r-id">ID: {bookingInfo.id}</p>
              </div>

              <div className="r-meta">
                  <div className="r-meta-row"><strong>Processed by:</strong> {bookingInfo.processor}</div>
                  <div className="r-meta-row"><strong>Time:</strong> {bookingInfo.processTime}</div>
              </div>

              <div className="r-divider"></div>

              <table className="r-table">
                  <thead>
                      <tr>
                          <th style={{width:'40px'}}>No.</th>
                          <th style={{textAlign:'left'}}>Description</th>
                          <th style={{width:'50px'}}>Qty</th>
                          <th style={{width:'80px'}}>Price</th>
                          <th style={{width:'90px'}}>Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      {bookingInfo.items?.map((item, idx) => (
                          <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td style={{textAlign:'left', paddingRight:'10px'}}>{item.desc}</td>
                              <td>{item.qty}</td>
                              <td>${item.price}</td>
                              <td>${item.amount}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>

              <div className="r-divider"></div>

              <div className="r-summary">
                  <div className="rs-row"><span>Promotion:</span> <span>-${Math.abs(bookingInfo.promotion)}</span></div>
                  <div className="rs-row"><span>Tax (10%):</span> <span>${bookingInfo.tax}</span></div>
                  <div className="rs-row total"><span>Total:</span> <span>${bookingInfo.total}</span></div>
              </div>

              <div className="r-divider"></div>

              <div className="r-payment-info">
                  <div className="rs-row"><strong>Payment method:</strong> <span>{paymentMode === 'full' ? 'Full Payment' : 'Partial Payment'}</span></div>
                  {paymentMethods.map(pm => pm.amount > 0 && (
                      <div className="rs-row" key={pm.id}>
                          <span style={{textTransform:'capitalize'}}>{pm.method}:</span> 
                          <span>${pm.amount}</span>
                      </div>
                  ))}
                  <div className="rs-row"><span>Change Due:</span> <span>0</span></div>
              </div>

              <div className="r-footer">
                  <p>THANK YOU!</p>
                  <div className="barcode">*{bookingInfo.id}*</div>
              </div>
          </div>
          
          <div className="receipt-actions">
             <button className="btn-action-print" onClick={() => window.print()}>Print</button>
             <button className="btn-action-done" onClick={() => navigate('/receptionist/review')}>Done</button>
          </div>
      </div>
  )

  return (
    <div className="payment-page-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');
        
        .payment-page-container, button, input, select, table { font-family: 'Poppins', sans-serif !important; }
        .payment-page-container { background-color: white; min-height: 100vh; padding-bottom: 50px; }
        .payment-main-content { padding: 20px clamp(20px, 5vw, 60px); max-width: 1400px; margin: 0 auto; }

        .payment-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; }
        .ph-left .ph-title { font-size: 24px; font-weight: 800; color: #0b2341; margin-bottom: 10px; }
        .ph-customer { display: flex; align-items: center; gap: 10px; font-size: 16px; color: #0b2341; }
        .ph-customer i { font-size: 24px; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 15px; border: 1px solid; border-radius: 20px; font-weight: 600; font-size: 14px; background-color: white; }
        .status-badge.partial { border-color: #2dd454; color: #2dd454; }
        .status-badge.full { border-color: #2dd454; color: white; background-color: #2dd454; }
        
        .ph-right { text-align: right; font-size: 14px; color: #0b2341; }

        .payment-body { display: flex; gap: 40px; }
        .pb-left-col { flex: 6; }
        .pb-right-col { flex: 4; }

        .payment-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .payment-table th { background-color: #0b2341; color: white; padding: 12px 10px; font-size: 14px; font-weight: 600; text-align: center; }
        .payment-table th:nth-child(2) { text-align: left; }
        .payment-table td { border-bottom: 1px solid #ddd; padding: 12px 10px; color: #0b2341; font-size: 14px; }
        .text-center { text-align: center; }

        .btn-add-charge { background-color: #0b2341; color: white; padding: 10px 20px; border-radius: 20px; border: none; font-weight: 600; cursor: pointer; font-size: 13px; float: right; }

        .summary-section { margin-bottom: 30px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; color: #555; font-weight: 500; }
        .promo-code { margin-left: 50px; }
        .text-red { color: #e63946; }
        .summary-divider { height: 2px; background-color: #0b2341; margin: 15px 0; }
        .total-row { font-size: 20px; font-weight: 800; color: #0b2341; }

        .mode-toggle { display: inline-flex; gap: 15px; margin-left: 20px; }
        .mode-option { cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 5px; color: #888; }
        .mode-option.selected { color: #0b2341; font-weight: 700; }
        .mode-option input { accent-color: #0b2341; }

        .pm-header { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #555; margin-bottom: 15px; }
        .pm-row { display: flex; align-items: center; margin-bottom: 15px; gap: 10px; }
        .pm-index { font-weight: 600; width: 20px; }
        .pm-options { flex: 1; display: flex; gap: 15px; }
        
        .pm-radio { display: flex; align-items: center; cursor: pointer; font-size: 14px; color: #555; position: relative; padding-left: 25px; user-select: none; }
        .pm-radio input { position: absolute; opacity: 0; cursor: pointer; }
        .checkmark { position: absolute; top: 0; left: 0; height: 18px; width: 18px; border: 1px solid #aaa; border-radius: 50%; background-color: white; }
        .pm-radio.active .checkmark { border-color: #0b2341; }
        .pm-radio.active .checkmark:after { content: ""; position: absolute; display: block; top: 3px; left: 3px; width: 10px; height: 10px; border-radius: 50%; background: #0b2341; }

        .pm-amount { display: flex; align-items: center; width: 100px; justify-content: flex-end; font-weight: 600; }
        .pm-amount input { width: 80px; border: none; text-align: right; font-size: 15px; color: #0b2341; outline: none; font-weight: 600; background: transparent; }

        .btn-confirm-red { background-color: #ff3333; color: white; border: none; padding: 8px 20px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 14px; float: right; }
        
        .payment-footer-actions { margin-top: 40px; display: flex; flex-direction: column; align-items: flex-end; gap: 15px; }
        .print-receipt-check { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #0b2341; cursor: pointer; }
        .action-buttons { display: flex; gap: 15px; }
        .btn-save-draft { background-color: #4a4a4a; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-process { border: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; color: white; }
        .btn-process.disabled { background-color: #aaa; cursor: not-allowed; }
        .btn-process.active { background-color: #2dd454; }

        .success-view-container { background: #f5f5f0; padding: 40px; max-width: 900px; margin: 0 auto; border-radius: 10px; }
        .sv-header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0b2341; }
        .sv-title { color: #0b2341; font-weight: 800; margin-bottom: 15px; }
        .sv-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; color: #333; gap: 30px; }
        .sv-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: white; }
        .sv-table th, .sv-table td { padding: 15px; text-align: left; border-bottom: 1px solid #ddd; }
        .sv-table th { background: #f0f0f0; color: #0b2341; font-weight: 700; }
        .sv-summary-row td { background: #f9f9f9; text-align: right; }
        .sv-total-row td { background: #eef; text-align: right; font-size: 18px; color: #0b2341; }
        .sv-footer { text-align: center; margin-top: 40px; }
        .sv-footer h3 { color: #0b2341; font-size: 20px; margin-bottom: 20px; letter-spacing: 2px; }
        .btn-back-home { background: #0b2341; color: white; padding: 10px 30px; border-radius: 20px; border: none; cursor: pointer; font-weight: 600; }

        .receipt-view-wrapper { display: flex; flex-direction: column; align-items: center; background: #eee; min-height: 100vh; padding: 40px; }
        .receipt-paper { background: #fffdf5; width: 450px; padding: 40px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 5px; font-family: 'Courier New', Courier, monospace !important; color: #333; position: relative; }
        .receipt-header { text-align: center; margin-bottom: 30px; }
        .r-title { font-size: 32px; font-weight: 900; color: #0b2341; margin: 10px 0; letter-spacing: 2px; }
        .r-id { font-size: 14px; color: #555; }
        
        .r-meta { margin-bottom: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; font-size: 13px; }
        .r-meta-row { display: block; }

        .r-divider { border-bottom: 1px dashed #333; margin: 20px 0; }
        
        .r-table { width: 100%; font-size: 13px; border-collapse: collapse; }
        .r-table th { text-align: center; padding: 10px 5px; font-weight: bold; border-bottom: 1px solid #ddd; }
        .r-table td { text-align: center; padding: 12px 5px; vertical-align: top; }
        .r-summary { font-size: 13px; text-align: right; margin-top: 10px; }
        .rs-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .rs-row.total { font-weight: 900; font-size: 18px; margin-top: 15px; }
        .r-payment-info { font-size: 13px; }
        .r-footer { text-align: center; font-size: 11px; margin-top: 40px; line-height: 1.4; }
        
        .barcode { 
            font-family: 'Libre Barcode 39', cursive;
            font-size: 65px;
            margin: 10px auto; 
            display: block;
            transform: scale(1, 1.2); 
            line-height: 1;
            white-space: nowrap; 
            width: fit-content;
            overflow: hidden; 
        }

        .receipt-actions { margin-top: 30px; display: flex; gap: 15px; }
        .btn-action-print { background: #fff; border: 2px solid #0b2341; color: #0b2341; padding: 10px 30px; cursor: pointer; border-radius: 25px; font-weight: 700; transition: 0.2s; }
        .btn-action-print:hover { background: #f0f0f0; }
        .btn-action-done { background: #0b2341; color: white; padding: 10px 40px; border: none; cursor: pointer; border-radius: 25px; font-weight: 700; transition: 0.2s; }
        .btn-action-done:hover { background: #163a66; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; }
        .charge-modal { background: white; padding: 25px; border-radius: 12px; width: 400px; }
        .form-row { margin-bottom: 15px; } .form-select, .form-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .btn-cancel { background: #eee; padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; }
        .btn-add { background: #0b2341; color: white; padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; }

        @media (max-width: 900px) { .payment-body { flex-direction: column; } }
      `}</style>

      {viewState === 'payment' && (
         <>
            <Header isLoggedIn={true} role="receptionist" />
            <main className="payment-main-content">
                <div className="payment-header">
                    <div className="ph-left">
                        <div style={{marginBottom:'5px', cursor:'pointer', color:'#666', fontSize:'14px', display:'flex', alignItems:'center', gap:'5px', fontWeight: 600}} onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-arrow-left"></i> Back to Review
                        </div>
                        <h1 className="ph-title">{paymentMode === 'full' ? 'Full Payment' : 'Split Payments'} - {bookingInfo.id}</h1>
                        <div className="ph-customer"><i className="fa-solid fa-circle-user"></i><span>{bookingInfo.customerName}</span></div>
                    </div>
                    <div className="ph-center">
                        <span className={`status-badge ${paymentMode}`}>
                            <i className="fa-solid fa-dollar-sign"></i> {paymentMode === 'full' ? 'Full Payment' : 'Partial Payment'}
                        </span>
                    </div>
                    <div className="ph-right">
                        <div className="processor-info"><strong>Processed by:</strong> {bookingInfo.processor}</div>
                        <div className="process-time">{bookingInfo.processTime} <i className="fa-regular fa-calendar"></i></div>
                    </div>
                </div>
                {renderPaymentForm()}
            </main>
         </>
      )}

      {viewState === 'success' && renderSuccessView()}
      {viewState === 'receipt' && renderReceiptView()}

      {showAddChargeModal && (
        <div className="modal-overlay">
            <div className="charge-modal">
                <h3 style={{marginBottom:'20px'}}>Add Compensation Fee</h3>
                <div className="form-row">
                    <label>Item:</label>
                    <select className="form-select" value={selectedBrokenItem} onChange={(e) => setSelectedBrokenItem(e.target.value)}>
                        {brokenItemsList.map(item => <option key={item.id} value={item.id}>{item.name} - ${item.price}</option>)}
                    </select>
                </div>
                <div className="form-row">
                    <label>Quantity:</label>
                    <input type="number" min="1" className="form-input" value={brokenItemQty} onChange={(e) => setBrokenItemQty(e.target.value)} />
                </div>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setShowAddChargeModal(false)}>Cancel</button>
                    <button className="btn-add" onClick={handleAddCharge}>Add Charge</button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default PaymentPage
