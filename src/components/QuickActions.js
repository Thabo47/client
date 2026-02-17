import React from 'react';
import './QuickActions.css';

const QuickActions = ({ 
  onToggleCalculator, 
  onToggleSimulator, 
  onToggleComparison, 
  onToggleDarkMode,
  darkMode,
  showCalculator,
  showSimulator,
  showComparison
}) => {
  return (
    <div className="quick-actions">
      <button 
        className={`action-btn ${showCalculator ? 'active' : ''}`} 
        onClick={onToggleCalculator}
        data-tooltip="Loan Calculator"
        aria-label="Open loan calculator"
      >
        <span className="action-icon">📊</span>
        <span className="action-label">Calculator</span>
      </button>
      
      <button 
        className={`action-btn ${showSimulator ? 'active' : ''}`} 
        onClick={onToggleSimulator}
        data-tooltip="Credit Score Simulator"
        aria-label="Open credit score simulator"
      >
        <span className="action-icon">📈</span>
        <span className="action-label">Credit Sim</span>
      </button>
      
      <button 
        className={`action-btn ${showComparison ? 'active' : ''}`} 
        onClick={onToggleComparison}
        data-tooltip="Compare Loans"
        aria-label="Open loan comparison tool"
      >
        <span className="action-icon">🔄</span>
        <span className="action-label">Compare</span>
      </button>
      
      <button 
        className="action-btn" 
        onClick={onToggleDarkMode}
        data-tooltip={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle dark mode"
      >
        <span className="action-icon">{darkMode ? '☀️' : '🌙'}</span>
        <span className="action-label">{darkMode ? 'Light' : 'Dark'}</span>
      </button>
    </div>
  );
};

export default QuickActions;