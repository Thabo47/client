import React, { useState, useEffect } from 'react';

function LoanHistory({ applications, onViewDetails, onNewApplication }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.result === filter;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'amount') {
      return b.loanAmount - a.loanAmount;
    }
    return 0;
  });

  const getResultColor = (result) => {
    switch(result) {
      case 'approved': return 'var(--success-green)';
      case 'conditional': return 'var(--gold)';
      case 'rejected': return 'var(--deep-red)';
      default: return 'var(--gray)';
    }
  };

  const getResultText = (result) => {
    switch(result) {
      case 'approved': return 'Approved';
      case 'conditional': return 'Conditional';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="card">
      <h1 className="form-title">
        Loan Application History
      </h1>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: `2px solid ${filter === 'all' ? 'var(--sunset-orange)' : 'var(--gray-light)'}`,
              background: filter === 'all' ? 'var(--sunset-orange)' : 'transparent',
              color: filter === 'all' ? 'white' : 'var(--gray)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('approved')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: `2px solid ${filter === 'approved' ? 'var(--success-green)' : 'var(--gray-light)'}`,
              background: filter === 'approved' ? 'var(--success-green)' : 'transparent',
              color: filter === 'approved' ? 'white' : 'var(--gray)',
              cursor: 'pointer'
            }}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('conditional')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: `2px solid ${filter === 'conditional' ? 'var(--gold)' : 'var(--gray-light)'}`,
              background: filter === 'conditional' ? 'var(--gold)' : 'transparent',
              color: filter === 'conditional' ? 'white' : 'var(--gray)',
              cursor: 'pointer'
            }}
          >
            Conditional
          </button>
          <button
            onClick={() => setFilter('rejected')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: `2px solid ${filter === 'rejected' ? 'var(--deep-red)' : 'var(--gray-light)'}`,
              background: filter === 'rejected' ? 'var(--deep-red)' : 'transparent',
              color: filter === 'rejected' ? 'white' : 'var(--gray)',
              cursor: 'pointer'
            }}
          >
            Rejected
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '2px solid var(--gold)',
            background: 'var(--white)'
          }}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {/* Applications List */}
      {sortedApplications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>
            No applications found. Start by applying for a loan!
          </p>
          <button 
            className="new-application-btn"
            onClick={onNewApplication}
            style={{ marginTop: '1rem' }}
          >
            Apply Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {sortedApplications.map((app, index) => (
            <div
              key={index}
              style={{
                background: 'var(--off-white)',
                borderRadius: '10px',
                padding: '1.5rem',
                border: `2px solid ${getResultColor(app.result)}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
              }}
              onClick={() => onViewDetails(app)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ color: getResultColor(app.result), marginBottom: '0.3rem' }}>
                    M {app.loanAmount.toLocaleString()}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
                    {new Date(app.date).toLocaleDateString()} • {app.repaymentPeriod} months
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: getResultColor(app.result),
                    color: 'white',
                    padding: '0.3rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {getResultText(app.result).toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px dashed var(--gold)'
              }}>
                <div>
                  <small style={{ color: 'var(--gray)' }}>Credit Score</small>
                  <p style={{ fontWeight: 'bold' }}>{app.creditScore}</p>
                </div>
                <div>
                  <small style={{ color: 'var(--gray)' }}>Income</small>
                  <p style={{ fontWeight: 'bold' }}>M {app.income.toLocaleString()}/mo</p>
                </div>
                <div>
                  <small style={{ color: 'var(--gray)' }}>DTI Ratio</small>
                  <p style={{ fontWeight: 'bold' }}>
                    {((app.expenses + (app.existingDebts * 0.03)) / app.income * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LoanHistory;