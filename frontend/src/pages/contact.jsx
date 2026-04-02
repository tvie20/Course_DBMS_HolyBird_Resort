import React from 'react';
import mapImg from '../assets/map.jpg'; // Import ảnh bản đồ

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
        <h2 className="contact-main-title">CONTACT</h2>
        
        <div className="contact-container">
            
            {/* --- CỘT TRÁI: THÔNG TIN LIÊN HỆ --- */}
            <div className="contact-info-col">
                
                <div className="info-block">
                    <h3 className="info-title">COME VISIT US</h3>
                    <p className="info-desc">
                        Looking to book directly, ask a question?<br />
                        We're happy to help and always just one message away.
                    </p>
                </div>

                <div className="info-block">
                    <h3 className="info-title">PHONE</h3>
                    <div className="info-detail-wrapper">
                        <p className="info-detail">(+84) 983868386</p>
                    </div>
                </div>

                <div className="info-block">
                    <h3 className="info-title">EMAIL</h3>
                    <div className="info-detail-wrapper">
                        <p className="info-detail">holybirdresort4@gmail.com</p>
                    </div>
                </div>

                <div className="info-block">
                    <h3 className="info-title">SOCIAL</h3>
                    <div className="social-icons">
                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i className="fa-brands fa-telegram"></i></a>
                        <a href="#"><i className="fa-brands fa-instagram"></i></a>
                    </div>
                </div>

            </div>

            {/* --- CỘT PHẢI: BẢN ĐỒ --- */}
            <div className="contact-map-col">
                <h3 className="info-title">WHERE YOU'LL FIND US?</h3>
                <p className="info-desc">
                    Located by the crystal-clear waters of Nha Trang Bay, VietNam.<br />
                    <strong>Exact location shared after booking for your privacy and peace of mind.</strong>
                </p>
                
                <div className="map-image-wrapper">
                    <img src={mapImg} alt="Resort Location Map" />
                </div>
            </div>

        </div>
    </section>
  );
};

export default Contact;