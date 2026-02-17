import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const branchLocations = [
    {
      city: 'Johannesburg',
      address: '123 Maude Street, Sandton, 2196',
      phone: '+27 11 234 5678',
      email: 'jhb@motsitseng.co.za',
      hours: 'Mon-Fri: 8:00 - 17:00'
    },
    {
      city: 'Cape Town',
      address: '45 St George\'s Mall, Cape Town, 8001',
      phone: '+27 21 345 6789',
      email: 'cpt@motsitseng.co.za',
      hours: 'Mon-Fri: 8:00 - 17:00'
    },
    {
      city: 'Durban',
      address: '78 West Street, Durban, 4001',
      phone: '+27 31 456 7890',
      email: 'dbn@motsitseng.co.za',
      hours: 'Mon-Fri: 8:00 - 17:00'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for contacting us! We will respond within 24 hours.'
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p className="hero-subtitle">We're here to help you with any questions or concerns</p>
      </div>

      <div className="contact-grid">
        {/* Contact Information */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div className="info-details">
                <h3>Phone</h3>
                <p>Toll-Free: 0800 123 456</p>
                <p>International: +27 11 234 5678</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <div className="info-details">
                <h3>Email</h3>
                <p>General: info@motsitseng.co.za</p>
                <p>Support: support@motsitseng.co.za</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🏢</div>
              <div className="info-details">
                <h3>Head Office</h3>
                <p>123 Maude Street</p>
                <p>Sandton, Johannesburg</p>
                <p>2196, South Africa</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <div className="info-details">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 8:00 - 17:00</p>
                <p>Saturday: 9:00 - 13:00</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="social-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="LinkedIn">🔗</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper">
          <h2>Send us a Message</h2>
          
          {formStatus.submitted && formStatus.success && (
            <div className="success-message">
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+27 XX XXX XXXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this regarding?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Branches Section */}
      <div className="branches-section">
        <h2>Our Branches</h2>
        <div className="branches-grid">
          {branchLocations.map((branch, index) => (
            <div key={index} className="branch-card">
              <h3>{branch.city}</h3>
              <p className="branch-address">{branch.address}</p>
              <p className="branch-phone">{branch.phone}</p>
              <p className="branch-email">{branch.email}</p>
              <p className="branch-hours">{branch.hours}</p>
              <button className="directions-btn">Get Directions</button>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <h2>Find Us</h2>
        <div className="map-container">
          <iframe
            title="Motsitseng Financial Services Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.08835196397!2d28.04567431502982!3d-26.107026983485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950dd0a5b3b7c3%3A0x9b0b3c0b5c5b3b0!2sSandton%2C%20Johannesburg%2C%202196!5e0!3m2!1sen!2sza!4v1620000000000!5m2!1sen!2sza"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;