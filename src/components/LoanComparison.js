import React, { useState } from 'react';
import './LoanComparison.css';

const LoanComparison = () => {
  const [loans, setLoans] = useState([
    {
      id: 1,
      name: 'Standard Personal Loan',
      amount: 100000,
      rate: 12.5,
      term: 5,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0
    },
    {
      id: 2,
      name: 'Premium Loan',
      amount: 100000,
      rate: 10.5,
      term: 5,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0
    }
  ]);

  const calculateLoan = (loan) => {
    const principal = loan.amount;
    const monthlyRate = loan.rate / 100 / 12;
    const numberOfPayments = loan.term * 12;
    
    if (monthlyRate === 0) {
      return {
        ...loan,
        monthlyPayment: principal / numberOfPayments,
        totalPayment: principal,
        totalInterest: 0
      };
    }
    
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    return {
      ...loan,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest
    };
  };

  const updateLoan = (id, field, value) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === id) {
        const updated = { ...loan, [field]: value };
        return calculateLoan(updated);
      }
      return loan;
    }));
  };

  const addLoan = () => {
    const newId = loans.length + 1;
    setLoans(prev => [
      ...prev,
      calculateLoan({
        id: newId,
        name: `Loan Option ${newId}`,
        amount: 100000,
        rate: 12.5,
        term: 5,
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0
      })
    ]);
  };

  const removeLoan = (id) => {
    if (loans.length > 1) {
      setLoans(prev => prev.filter(loan => loan.id !== id));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const findBestLoan = () => {
    return loans.reduce((best, current) => {
      return current.monthlyPayment < best.monthlyPayment ? current : best;
    }, loans[0]);
  };

  const bestLoan = findBestLoan();

  return (
    <div className="comparison-container">
      <h3>Loan Comparison Tool</h3>
      <p className="comparison-subtitle">Compare different loan options side by side</p>

      <div className="loans-grid">
        {loans.map(loan => (
          <div key={loan.id} className={`loan-card ${bestLoan.id === loan.id ? 'best' : ''}`}>
            {bestLoan.id === loan.id && <span className="best-badge">Best Value</span>}
            
            <div className="loan-header">
              <input
                type="text"
                value={loan.name}
                onChange={(e) => updateLoan(loan.id, 'name', e.target.value)}
                className="loan-name-input"
                placeholder="Loan name"
              />
              {loans.length > 1 && (
                <button 
                  className="remove-loan"
                  onClick={() => removeLoan(loan.id)}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="loan-inputs">
              <div className="input-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={loan.amount}
                  onChange={(e) => updateLoan(loan.id, 'amount', Number(e.target.value))}
                  min="1000"
                  step="1000"
                />
              </div>

              <div className="input-group">
                <label>Rate (%)</label>
                <input
                  type="number"
                  value={loan.rate}
                  onChange={(e) => updateLoan(loan.id, 'rate', Number(e.target.value))}
                  min="5"
                  max="25"
                  step="0.1"
                />
              </div>

              <div className="input-group">
                <label>Term (years)</label>
                <input
                  type="number"
                  value={loan.term}
                  onChange={(e) => updateLoan(loan.id, 'term', Number(e.target.value))}
                  min="1"
                  max="30"
                />
              </div>
            </div>

            <div className="loan-results">
              <div className="result-item">
                <span className="result-label">Monthly:</span>
                <span className="result-value highlight">{formatCurrency(loan.monthlyPayment)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total:</span>
                <span className="result-value">{formatCurrency(loan.totalPayment)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Interest:</span>
                <span className="result-value">{formatCurrency(loan.totalInterest)}</span>
              </div>
            </div>

            <div className="savings-indicator">
              {bestLoan.id === loan.id ? (
                <span className="savings-positive">✓ Best Option</span>
              ) : (
                <span className="savings-negative">
                  Pay {formatCurrency(loan.totalPayment - bestLoan.totalPayment)} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="add-loan-btn" onClick={addLoan}>
        + Compare Another Option
      </button>

      <div className="comparison-summary">
        <h4>Summary</h4>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Best Monthly Payment:</span>
            <span className="stat-value">{formatCurrency(bestLoan.monthlyPayment)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Potential Savings:</span>
            <span className="stat-value highlight">
              {formatCurrency(loans.reduce((max, loan) => {
                const diff = loan.totalPayment - bestLoan.totalPayment;
                return diff > max ? diff : max;
              }, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanComparison;