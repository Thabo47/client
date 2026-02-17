import React from 'react';
import './RecentApplications.css';

const RecentApplications = ({ applications }) => {
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
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-ZA', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return '✅';
      case 'conditional': return '⚠️';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  if (!applications || applications.length === 0) {
    return null;
  }

  return (
    <div className="recent-applications">
      <h4>Recent Applications</h4>
      <div className="recent-list">
        {applications.map(app => (
          <div key={app.id} className="recent-item">
            <div className="recent-item-left">
              <span className="recent-status-icon">{getStatusIcon(app.decision)}</span>
              <div className="recent-details">
                <span className="recent-amount">{formatCurrency(app.amount)}</span>
                <span className="recent-date">{formatDate(app.date)}</span>
              </div>
            </div>
            <span className={`recent-status status-${app.decision}`}>
              {app.decision}
            </span>
          </div>
        ))}
      </div>
      <div className="recent-footer">
        <button className="view-all-btn">View All Applications</button>
      </div>
    </div>
  );
};

export default RecentApplications;