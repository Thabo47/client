import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    alert(`Thank you for subscribing with: ${email}`);
    e.target.reset();
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Motsitseng Financial Services</h4>
          <p>Your trusted financial partner since 2010</p>
          <p className="regulated">Regulated by the National Credit Regulator</p>
          <p className="license">NCRCP 12345</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#rates">Interest Rates</a></li>
            <li><a href="#apply">Apply for Loan</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p><span className="icon">📞</span> 0800 123 456</p>
          <p><span className="icon">✉️</span> info@motsitseng.co.za</p>
          <p><span className="icon">📍</span> Sandton, Johannesburg</p>
          <p><span className="icon">🕒</span> Mon-Fri: 8:00 - 17:00</p>
        </div>
        
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">📘</a>
            <a href="#" className="social-link" aria-label="Twitter">🐦</a>
            <a href="#" className="social-link" aria-label="Instagram">📷</a>
            <a href="#" className="social-link" aria-label="LinkedIn">🔗</a>
          </div>
          <p className="newsletter-text">Subscribe to our newsletter</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Your email" 
              required
              aria-label="Email for newsletter"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Motsitseng Financial Services. All rights reserved.</p>
        <p>Registered with the National Credit Regulator</p>
      </div>
    </footer>
  );
};

export default Footer;