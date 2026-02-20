import React from 'react';

function Navigation({ currentPage, onNavigate, applicationCount = 0 }) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="logo">
          
          MFS Loan Assessor
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === 'apply' ? 'active' : ''}`}
            onClick={() => onNavigate('apply')}
          >
            <span style={{ marginRight: '5px' }}></span>
            Apply
          </button>
          <button
            className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => onNavigate('history')}
            style={{ position: 'relative' }}
          >
            <span style={{ marginRight: '5px' }}></span>
            History
            {applicationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--gold)',
                color: 'var(--deep-red)',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {applicationCount}
              </span>
            )}
          </button>
          <button
            className={`nav-link ${currentPage === 'result' ? 'active' : ''}`}
            onClick={() => onNavigate('result')}
          >
            <span style={{ marginRight: '5px' }}></span>
            Result
          </button>
          <button
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => onNavigate('about')}
          >
            <span style={{ marginRight: '5px' }}></span>
            About
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;