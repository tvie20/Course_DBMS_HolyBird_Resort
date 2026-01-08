import React, { useRef, useState } from 'react';

// Import tài nguyên
import imgAbout from '../assets/about-1.jpg';
import vidPreview from '../assets/vid-preview.mp4';

const About = () => {
    // Logic xử lý Play/Pause video
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayVideo = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <section id="about" className="about-section">
            
            {/* --- PHẦN 1: CHỮ VÀ ẢNH --- */}
            <div className="about-top-container">
                
                {/* Cột trái: Nội dung Text */}
                <div className="about-text-content">
                    <h2 className="about-heading">
                        You're finally here!<br />
                        Let the sea soothe your soul.
                    </h2>
                    
                    <div className="about-paragraph">
                        <p>
                            You've explored the options, now discover the exception. Located directly by the <strong>crystal-clear waters of Nha Trang Bay</strong>, Holybird redefines coastal luxury. We are not just a resort; we are an <strong>exclusive 5-star sanctuary</strong> where personalized service meets breathtaking natural beauty.
                        </p>
                        <p>
                            What sets us apart is our meticulous attention to detail and our commitment to <strong>tranquil elegance</strong> - far surpassing the crowded, generic beachfront hotels. Imagine waking up to the sound of the waves in a room designed for <strong>absolute indulgence</strong>. 
                        </p>
                        <p>
                            Our amenities, from the infinity pool overlooking the bay to our private dining experiences, are crafted to cater only to your highest standards. <strong>This is the moment to secure your stay.</strong> Choose Holybird for the unparalleled luxury, the guaranteed serenity, and the most spectacular view on the Nha Trang coastline.
                        </p>
                        <p className="highlight-text">
                            Book your suite now and turn your dream vacation into reality!
                        </p>
                    </div>
                </div>

                {/* Cột phải: Ảnh */}
                <div className="about-image-container">
                    <img src={imgAbout} alt="Relaxing at Holybird Resort" />
                </div>
            </div>

            {/* --- PHẦN 2: VIDEO KHUNG TRANH --- */}
            <div className="about-video-wrapper">
                <div className="video-frame">
                    <video 
                        ref={videoRef}
                        src={vidPreview} 
                        loop 
                        muted 
                        className="main-video"
                        onClick={handlePlayVideo} // Bấm vào video cũng pause/play được
                    ></video>
                    
                    {/* Overlay: Nút Play (Chỉ hiện khi Pause) */}
                    {!isPlaying && (
                        <div className="video-overlay" onClick={handlePlayVideo}>
                            <div className="play-button">
                                <i className="fa-solid fa-play"></i>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </section>
    );
};

export default About;