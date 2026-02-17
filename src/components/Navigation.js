import React from 'react';
import './Navigation.css';

const Navigation = ({ currentView, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => onNavigate('home')}>
          <h1>Motsitseng Financial Services</h1>
          <span className="nav-subtitle">Your Trusted Financial Partner</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <span className="nav-icon">🏠</span>
            Home
          </button>
          <button 
            className={`nav-link ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => onNavigate('about')}
          >
            <span className="nav-icon">ℹ️</span>
            About
          </button>
          <button 
            className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
            onClick={() => onNavigate('contact')}
          >
            <span className="nav-icon">📞</span>
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;