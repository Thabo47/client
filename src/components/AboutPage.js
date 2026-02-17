import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const milestones = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'Motsitseng Financial Services was established with a mission to provide accessible financial solutions to all South Africans.'
    },
    {
      year: '2015',
      title: 'Expansion',
      description: 'Expanded operations to all 9 provinces, becoming a truly national financial services provider.'
    },
    {
      year: '2018',
      title: 'Digital Transformation',
      description: 'Launched our digital platform, making loan applications faster and more accessible.'
    },
    {
      year: '2024',
      title: 'Innovation Leader',
      description: 'Continuing to innovate with AI-powered loan assessment systems for fair and accurate decisions.'
    }
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Integrity',
      description: 'We operate with transparency and honesty in all our dealings.'
    },
    {
      icon: '⚖️',
      title: 'Fairness',
      description: 'Every applicant receives unbiased consideration based on clear criteria.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Leveraging technology to make better, faster lending decisions.'
    },
    {
      icon: '❤️',
      title: 'Community',
      description: 'Committed to empowering individuals and communities through financial inclusion.'
    }
  ];

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About Motsitseng Financial Services</h1>
        <p className="hero-subtitle">Empowering Dreams, Building Futures Since 2010</p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p className="mission-text">
            To provide accessible, fair, and responsible financial solutions that empower 
            individuals and businesses to achieve their goals. We believe in second chances 
            and building long-term relationships with our clients based on trust and mutual success.
          </p>
        </section>

        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <span className="value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="story-section">
          <h2>Our Story</h2>
          <p className="story-text">
            Founded in 2010 by a team of financial experts who saw a gap in the market for 
            personalized, fair lending practices, Motsitseng Financial Services has grown 
            from a small office in Johannesburg to a nationwide financial services provider. 
            Our name "Motsitseng" means "place of peace" in Sesotho, reflecting our commitment 
            to providing peace of mind through financial stability.
          </p>
        </section>

        <section className="milestones-section">
          <h2>Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <h2>By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Loans Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">R2.5B+</span>
              <span className="stat-label">Disbursed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">15</span>
              <span className="stat-label">Branches Nationwide</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">98%</span>
              <span className="stat-label">Customer Satisfaction</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;