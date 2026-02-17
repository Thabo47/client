import React, { useState } from 'react';
import './HomePage.css';
import LoanApplicationForm from './LoanApplicationForm';
import LoanCalculator from './LoanCalculator';
import CreditScoreSimulator from './CreditScoreSimulator';
import LoanComparison from './LoanComparison';

const HomePage = ({ 
  onFormSubmit, 
  onCalculatorApply, 
  onScoreApply,
  showCalculator,
  showSimulator,
  showComparison,
  onToggleCalculator,
  onToggleSimulator,
  onToggleComparison,
  recentApplications 
}) => {
  const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'calculator', 'simulator', 'compare'

  const features = [
    {
      id: 'apply',
      icon: '📝',
      title: 'Apply for Loan',
      description: 'Quick and easy application process',
      color: '#667eea'
    },
    {
      id: 'calculator',
      icon: '📊',
      title: 'Loan Calculator',
      description: 'Calculate your monthly payments',
      color: '#52c41a'
    },
    {
      id: 'simulator',
      icon: '📈',
      title: 'Credit Simulator',
      description: 'Check and improve your credit score',
      color: '#faad14'
    },
    {
      id: 'compare',
      icon: '🔄',
      title: 'Compare Loans',
      description: 'Find the best loan option for you',
      color: '#f5222d'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="home-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>Welcome to Motsitseng Financial Services</h1>
          <p>Your trusted partner for quick and easy loan approvals</p>
          <div className="banner-stats">
            <div className="stat">
              <span className="stat-value">50K+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat">
              <span className="stat-value">R2.5B+</span>
              <span className="stat-label">Disbursed</span>
            </div>
            <div className="stat">
              <span className="stat-value">98%</span>
              <span className="stat-label">Approval Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Feature Tabs */}
      <div className="feature-tabs">
        {features.map(feature => (
          <button
            key={feature.id}
            className={`feature-tab ${activeTab === feature.id ? 'active' : ''}`}
            onClick={() => setActiveTab(feature.id)}
            style={{ '--feature-color': feature.color }}
          >
            <span className="tab-icon">{feature.icon}</span>
            <div className="tab-text">
              <span className="tab-title">{feature.title}</span>
              <span className="tab-description">{feature.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="home-content">
        <div className="content-main">
          {activeTab === 'apply' && (
            <div className="content-section apply-section">
              <h2>Apply for a Loan</h2>
              <p className="section-subtitle">Fill in your details below to get started</p>
              <LoanApplicationForm onSubmit={onFormSubmit} />
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="content-section calculator-section">
              <h2>Loan Calculator</h2>
              <p className="section-subtitle">Calculate your monthly payments and total interest</p>
              <LoanCalculator onCalculate={onCalculatorApply} />
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="content-section simulator-section">
              <h2>Credit Score Simulator</h2>
              <p className="section-subtitle">See how different factors affect your credit score</p>
              <CreditScoreSimulator onScoreChange={onScoreApply} />
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="content-section comparison-section">
              <h2>Loan Comparison</h2>
              <p className="section-subtitle">Compare different loan options side by side</p>
              <LoanComparison />
            </div>
          )}
        </div>

        {/* Sidebar - Recent Activity */}
        <div className="content-sidebar">
          {recentApplications && recentApplications.length > 0 && (
            <div className="recent-activity-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentApplications.map(app => (
                  <div key={app.id} className="activity-item">
                    <div className="activity-icon">
                      {app.decision === 'approved' ? '✅' : app.decision === 'conditional' ? '⚠️' : '❌'}
                    </div>
                    <div className="activity-details">
                      <div className="activity-amount">{formatCurrency(app.amount)}</div>
                      <div className="activity-meta">
                        <span className={`activity-status status-${app.decision}`}>
                          {app.decision}
                        </span>
                        <span className="activity-date">{formatDate(app.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-btn">View All Applications</button>
            </div>
          )}

          <div className="info-card">
            <h3>Need Help?</h3>
            <p>Our loan experts are here to assist you</p>
            <div className="info-contacts">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>0800 123 456</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>support@motsitseng.co.za</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span>Live Chat (24/7)</span>
              </div>
            </div>
          </div>

          <div className="tips-card">
            <h3>Quick Tips</h3>
            <ul className="tips-list">
              <li>✓ Maintain a credit score above 700 for best rates</li>
              <li>✓ Keep your debt-to-income ratio below 40%</li>
              <li>✓ Have all documents ready before applying</li>
              <li>✓ Consider a shorter loan term to save on interest</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="why-choose-us">
        <h2>Why Choose Motsitseng Financial Services?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Quick Approval</h3>
            <p>Get approved in as little as 24 hours</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>Competitive Rates</h3>
            <p>Interest rates starting from 10.5% p.a.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <h3>Secure Process</h3>
            <p>Your data is encrypted and protected</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <h3>Personal Service</h3>
            <p>Dedicated loan officers to guide you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;