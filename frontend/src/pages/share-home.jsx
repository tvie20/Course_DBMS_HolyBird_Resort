import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Accommodations from './accomodations'; 
import Gallery from './gallery';
import Promotions from './promotions';
import About from './about';
import Contact from './contact';
import '../App.css';

const SharedHome = ({ role, HeroBtn }) => {
  const navigate = useNavigate();

  // Logic xác định đăng nhập
  const isLoggedIn = !!role; 

  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleLogin = () => {
    navigate('/login'); 
  };

  const updateURL = (hashId) => {
    let path = window.location.pathname;
    if (!path.endsWith('/')) {
        path += '/';
    }
    window.history.replaceState(null, null, path + hashId);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);

      if (window.scrollY < 100) {
        setActiveSection('home');
        if (window.location.hash !== '#home') updateURL('#home');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.scrollY >= 100) {
            const id = entry.target.id;
            setActiveSection(id);
            updateURL(`#${id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px" } 
    );

    const sections = document.querySelectorAll('#home, #accommodations, #gallery, #promotions, #about, #contact');
    sections.forEach((section) => observer.observe(section));

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateURL('#home');
    setActiveSection('home');
  };

  return (
    <div className="home-page">
      <section id="home" className="hero-section">
        <div className="fixed-nav-container">
            {/* --- SỬA Ở ĐÂY: Truyền thêm role={role} --- */}
            <Header isLoggedIn={isLoggedIn} role={role} />
            <Navbar activeSection={activeSection} role={role} />
        </div>

        <div className="hero-content">
            <h1 className="main-title">HOLYBIRD RESORT</h1>
            <h2 className="sub-title">YOUR UNFORGETTABLE GATEWAY</h2>
            
            {!isLoggedIn ? (
                <button className="login-btn" onClick={handleLogin}>LOG IN</button>
            ) : (
                HeroBtn
            )}
        </div>
      </section>

      <div id="accommodations"><Accommodations /></div>
      <div id="gallery"><Gallery /></div>
      <div id="promotions"><Promotions /></div>
      <div id="about"><About /></div>
      <div id="contact"><Contact /></div>

      {showScrollTop && (
        <button className="scroll-to-top-btn" onClick={scrollToTop}>
            <i className="fa-solid fa-angles-up"></i>
        </button>
      )}
    </div>
  );
}

export default SharedHome;