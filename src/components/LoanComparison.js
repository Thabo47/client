import React, { useState, useEffect } from 'react';
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
      totalInterest: 0,
      fees: 0,
      type: 'personal'
    },
    {
      id: 2,
      name: 'Premium Loan',
      amount: 100000,
      rate: 10.5,
      term: 5,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      fees: 500,
      type: 'premium'
    }
  ]);

  const [comparisonMetric, setComparisonMetric] = useState('monthly');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeFees, setIncludeFees] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize loans with calculations
  useEffect(() => {
    if (!initialized) {
      setLoans(prev => prev.map(loan => calculateLoan(loan)));
      setInitialized(true);
    }
  }, [initialized]);

  // Update chart data when loans change
  useEffect(() => {
    if (loans.length > 0) {
      generateChartData();
    }
  }, [loans, comparisonMetric]);

  const calculateLoan = (loan) => {
    const principal = Number(loan.amount) || 0;
    const rate = Number(loan.rate) || 0;
    const term = Number(loan.term) || 1;
    const fees = Number(loan.fees) || 0;
    
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    
    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalPayment = 0;
    let apr = 0;
    
    if (monthlyRate === 0 || principal === 0) {
      monthlyPayment = numberOfPayments > 0 ? principal / numberOfPayments : 0;
      totalPayment = principal + (includeFees ? fees : 0);
      totalInterest = 0;
      apr = term > 0 ? (fees / principal) * 100 / term : 0;
    } else {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      totalInterest = (monthlyPayment * numberOfPayments) - principal;
      totalPayment = principal + totalInterest + (includeFees ? fees : 0);
      apr = term > 0 ? ((totalInterest + fees) / principal) * 100 / term : 0;
    }
    
    return {
      ...loan,
      amount: principal,
      rate: rate,
      term: term,
      fees: fees,
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      apr: isNaN(apr) ? 0 : apr
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
    const newId = Date.now(); // Use timestamp for unique ID
    setLoans(prev => [
      ...prev,
      calculateLoan({
        id: newId,
        name: `Loan Option ${prev.length + 1}`,
        amount: 100000,
        rate: 12.5,
        term: 5,
        fees: 0,
        type: 'custom'
      })
    ]);
  };

  const removeLoan = (id) => {
    if (loans.length > 1) {
      setLoans(prev => prev.filter(loan => loan.id !== id));
    }
  };

  const duplicateLoan = (id) => {
    const loanToDuplicate = loans.find(l => l.id === id);
    if (loanToDuplicate) {
      const newId = Date.now() + 1; // Ensure unique ID
      setLoans(prev => [
        ...prev,
        calculateLoan({
          ...loanToDuplicate,
          id: newId,
          name: `${loanToDuplicate.name} (Copy)`
        })
      ]);
    }
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'R 0';
    }
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00%';
    }
    return value.toFixed(2) + '%';
  };

  const findBestLoan = (metric = comparisonMetric) => {
    if (loans.length === 0) return null;
    
    return loans.reduce((best, current) => {
      if (!best) return current;
      
      if (metric === 'monthly') {
        return current.monthlyPayment < best.monthlyPayment ? current : best;
      } else if (metric === 'total') {
        return current.totalPayment < best.totalPayment ? current : best;
      } else if (metric === 'apr') {
        return current.apr < best.apr ? current : best;
      }
      return best;
    }, loans[0]);
  };

  const generateChartData = () => {
    const data = loans.map(loan => {
      let value = 0;
      if (comparisonMetric === 'monthly') value = loan.monthlyPayment || 0;
      else if (comparisonMetric === 'total') value = loan.totalPayment || 0;
      else if (comparisonMetric === 'apr') value = loan.apr || 0;
      
      return {
        name: loan.name || 'Unnamed Loan',
        value: value,
        id: loan.id
      };
    });
    setChartData(data);
  };

  const bestLoan = findBestLoan();

  const getLoanTypeColor = (type) => {
    switch(type) {
      case 'personal': return '#667eea';
      case 'premium': return '#9b59b6';
      case 'business': return '#e74c3c';
      default: return '#3498db';
    }
  };

  const maxChartValue = chartData.length > 0 
    ? Math.max(...chartData.map(d => d.value || 0), 0.01) 
    : 1;

  const calculateSavings = () => {
    if (!bestLoan || loans.length < 2) return 0;
    
    return loans.reduce((max, loan) => {
      if (loan.id === bestLoan.id) return max;
      const diff = (loan.totalPayment || 0) - (bestLoan.totalPayment || 0);
      return diff > max ? diff : max;
    }, 0);
  };

  const calculateRateSpread = () => {
    if (loans.length === 0) return 0;
    const rates = loans.map(l => l.rate || 0);
    return Math.max(...rates) - Math.min(...rates);
  };

  const calculateMonthlySavings = () => {
    if (!bestLoan || loans.length < 2) return 0;
    
    return loans.reduce((max, loan) => {
      if (loan.id === bestLoan.id) return max;
      const diff = (loan.monthlyPayment || 0) - (bestLoan.monthlyPayment || 0);
      return diff > max ? diff : max;
    }, 0);
  };

  const calculateAPRSavings = () => {
    if (!bestLoan || loans.length < 2) return 0;
    
    return loans.reduce((max, loan) => {
      if (loan.id === bestLoan.id) return max;
      const diff = (loan.apr || 0) - (bestLoan.apr || 0);
      return diff > max ? diff : max;
    }, 0);
  };

  const copyToClipboard = () => {
    const comparisonText = loans.map(loan => 
      `${loan.name}: ${formatCurrency(loan.monthlyPayment)}/month, Total: ${formatCurrency(loan.totalPayment)}, APR: ${formatPercentage(loan.apr)}`
    ).join('\n');
    
    navigator.clipboard.writeText(comparisonText).then(() => {
      alert('Comparison copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const resetComparison = () => {
    setLoans([
      {
        id: 1,
        name: 'Standard Personal Loan',
        amount: 100000,
        rate: 12.5,
        term: 5,
        fees: 0,
        type: 'personal'
      },
      {
        id: 2,
        name: 'Premium Loan',
        amount: 100000,
        rate: 10.5,
        term: 5,
        fees: 500,
        type: 'premium'
      }
    ]);
  };

  if (!bestLoan) {
    return (
      <div className="comparison-container">
        <div className="comparison-header">
          <h3>🏦 Loan Comparison Tool</h3>
          <p className="comparison-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h3>🏦 Loan Comparison Tool</h3>
        <p className="comparison-subtitle">Compare different loan options side by side to find the best deal</p>
      </div>

      <div className="comparison-controls">
        <div className="metric-selector">
          <label>Compare by:</label>
          <select 
            value={comparisonMetric} 
            onChange={(e) => setComparisonMetric(e.target.value)}
            className="metric-select"
          >
            <option value="monthly">Monthly Payment</option>
            <option value="total">Total Cost</option>
            <option value="apr">APR (Annual Percentage Rate)</option>
          </select>
        </div>

        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▼ Hide Advanced' : '▶ Show Advanced Options'}
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeFees}
              onChange={(e) => {
                setIncludeFees(e.target.checked);
                setLoans(prev => prev.map(loan => calculateLoan(loan)));
              }}
            />
            Include fees in total cost calculation
          </label>
        </div>
      )}

      {/* Visual Comparison Chart */}
      {chartData.length > 0 && (
        <div className="comparison-chart">
          <h4>Visual Comparison ({comparisonMetric === 'monthly' ? 'Monthly Payment' : 
                               comparisonMetric === 'total' ? 'Total Cost' : 'APR'})</h4>
          <div className="chart-bars">
            {chartData.map(data => {
              const height = ((data.value || 0) / maxChartValue) * 100;
              const isBest = bestLoan && bestLoan.id === data.id;
              const loan = loans.find(l => l.id === data.id);
              
              return (
                <div key={data.id} className="chart-bar-container">
                  <div className="chart-bar-label">{data.name}</div>
                  <div className="chart-bar-wrapper">
                    <div 
                      className={`chart-bar ${isBest ? 'best-bar' : ''}`}
                      style={{ 
                        height: `${height}%`,
                        backgroundColor: loan ? getLoanTypeColor(loan.type) : '#667eea'
                      }}
                    >
                      <span className="chart-bar-value">
                        {comparisonMetric === 'apr' ? 
                          formatPercentage(data.value) : 
                          formatCurrency(data.value)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loan Cards Grid */}
      <div className="loans-grid">
        {loans.map(loan => {
          const isBest = bestLoan && bestLoan.id === loan.id;
          const loanColor = getLoanTypeColor(loan.type);
          
          return (
            <div 
              key={loan.id} 
              className={`loan-card ${isBest ? 'best' : ''}`}
              style={{ borderTop: isBest ? `4px solid ${loanColor}` : 'none' }}
            >
              {isBest && (
                <div className="best-badge" style={{ backgroundColor: loanColor }}>
                  🏆 Best {comparisonMetric === 'monthly' ? 'Monthly' : 
                              comparisonMetric === 'total' ? 'Total Cost' : 'APR'}
                </div>
              )}
              
              <div className="loan-header">
                <div className="loan-type-badge" style={{ backgroundColor: loanColor + '20', color: loanColor }}>
                  {loan.type ? loan.type.charAt(0).toUpperCase() + loan.type.slice(1) : 'Custom'}
                </div>
                <div className="loan-actions">
                  <button 
                    className="action-btn duplicate"
                    onClick={() => duplicateLoan(loan.id)}
                    title="Duplicate"
                  >
                    📋
                  </button>
                  {loans.length > 1 && (
                    <button 
                      className="action-btn remove"
                      onClick={() => removeLoan(loan.id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={loan.name || ''}
                onChange={(e) => updateLoan(loan.id, 'name', e.target.value)}
                className="loan-name-input"
                placeholder="Loan name"
                style={{ color: loanColor }}
              />

              <div className="loan-inputs">
                <div className="input-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={loan.amount || 0}
                    onChange={(e) => updateLoan(loan.id, 'amount', Number(e.target.value))}
                    min="1000"
                    step="1000"
                  />
                  <div className="input-presets">
                    <button onClick={() => updateLoan(loan.id, 'amount', 50000)}>50k</button>
                    <button onClick={() => updateLoan(loan.id, 'amount', 100000)}>100k</button>
                    <button onClick={() => updateLoan(loan.id, 'amount', 250000)}>250k</button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Rate (%)</label>
                  <input
                    type="number"
                    value={loan.rate || 0}
                    onChange={(e) => updateLoan(loan.id, 'rate', Number(e.target.value))}
                    min="5"
                    max="25"
                    step="0.1"
                  />
                  <div className="input-presets">
                    <button onClick={() => updateLoan(loan.id, 'rate', 8.5)}>8.5%</button>
                    <button onClick={() => updateLoan(loan.id, 'rate', 10.5)}>10.5%</button>
                    <button onClick={() => updateLoan(loan.id, 'rate', 12.5)}>12.5%</button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Term (years)</label>
                  <input
                    type="number"
                    value={loan.term || 1}
                    onChange={(e) => updateLoan(loan.id, 'term', Number(e.target.value))}
                    min="1"
                    max="30"
                  />
                  <div className="input-presets">
                    <button onClick={() => updateLoan(loan.id, 'term', 3)}>3y</button>
                    <button onClick={() => updateLoan(loan.id, 'term', 5)}>5y</button>
                    <button onClick={() => updateLoan(loan.id, 'term', 10)}>10y</button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Fees (R)</label>
                  <input
                    type="number"
                    value={loan.fees || 0}
                    onChange={(e) => updateLoan(loan.id, 'fees', Number(e.target.value))}
                    min="0"
                    step="100"
                  />
                </div>

                <div className="input-group">
                  <label>Loan Type</label>
                  <select
                    value={loan.type || 'custom'}
                    onChange={(e) => updateLoan(loan.id, 'type', e.target.value)}
                    className="type-select"
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="premium">Premium Loan</option>
                    <option value="business">Business Loan</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="loan-results">
                <div className="result-item">
                  <span className="result-label">Monthly Payment:</span>
                  <span className="result-value highlight">{formatCurrency(loan.monthlyPayment)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Total Payment:</span>
                  <span className="result-value">{formatCurrency(loan.totalPayment)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Total Interest:</span>
                  <span className="result-value">{formatCurrency(loan.totalInterest)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">APR:</span>
                  <span className="result-value">{formatPercentage(loan.apr)}</span>
                </div>
              </div>

              <div className="loan-progress">
                <div className="progress-item">
                  <span className="progress-label">Principal</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill principal"
                      style={{ 
                        width: `${loan.totalPayment > 0 ? (loan.amount / loan.totalPayment) * 100 : 0}%`,
                        backgroundColor: loanColor 
                      }}
                    />
                  </div>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Interest</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill interest"
                      style={{ width: `${loan.totalPayment > 0 ? (loan.totalInterest / loan.totalPayment) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                {loan.fees > 0 && (
                  <div className="progress-item">
                    <span className="progress-label">Fees</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill fees"
                        style={{ width: `${loan.totalPayment > 0 ? (loan.fees / loan.totalPayment) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {!isBest && bestLoan && (
                <div className="comparison-difference">
                  <span className="difference-label">vs Best:</span>
                  <span className="difference-value negative">
                    {comparisonMetric === 'monthly' && (
                      <>Pay {formatCurrency((loan.monthlyPayment || 0) - (bestLoan.monthlyPayment || 0))} more/month</>
                    )}
                    {comparisonMetric === 'total' && (
                      <>Pay {formatCurrency((loan.totalPayment || 0) - (bestLoan.totalPayment || 0))} more total</>
                    )}
                    {comparisonMetric === 'apr' && (
                      <>{formatPercentage((loan.apr || 0) - (bestLoan.apr || 0))} higher APR</>
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="comparison-actions">
        <button className="add-loan-btn" onClick={addLoan}>
          + Add Another Loan Option
        </button>
      </div>

      {/* Summary Section */}
      {bestLoan && (
        <div className="comparison-summary">
          <h4>📊 Comparison Summary</h4>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Best Monthly Payment:</span>
              <span className="stat-value highlight">{formatCurrency(bestLoan.monthlyPayment)}</span>
              <span className="stat-detail">from {bestLoan.name}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Best Total Cost:</span>
              <span className="stat-value highlight">{formatCurrency(bestLoan.totalPayment)}</span>
              <span className="stat-detail">from {bestLoan.name}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Best APR:</span>
              <span className="stat-value highlight">{formatPercentage(bestLoan.apr)}</span>
              <span className="stat-detail">from {bestLoan.name}</span>
            </div>
          </div>

          <div className="potential-savings">
            <h5>Potential Savings</h5>
            <div className="savings-grid">
              <div className="savings-card">
                <span className="savings-icon">💰</span>
                <span className="savings-label">By choosing best option:</span>
                <span className="savings-value">
                  {formatCurrency(calculateSavings())}
                </span>
              </div>
              <div className="savings-card">
                <span className="savings-icon">⏱️</span>
                <span className="savings-label">Interest rate spread:</span>
                <span className="savings-value">
                  {formatPercentage(calculateRateSpread())}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="recommendation-box">
            <h5>🎯 Recommendation</h5>
            <p>
              Based on your comparison, <strong>{bestLoan.name}</strong> offers the best 
              {comparisonMetric === 'monthly' ? ' monthly payment' : 
               comparisonMetric === 'total' ? ' total cost' : ' APR'}. 
              This option could save you {
                comparisonMetric === 'monthly' 
                  ? formatCurrency(calculateMonthlySavings()) + ' per month'
                  : comparisonMetric === 'total'
                  ? formatCurrency(calculateSavings())
                  : formatPercentage(calculateAPRSavings())
              }.
            </p>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="export-options">
        <button className="export-btn" onClick={copyToClipboard}>
          📋 Copy Summary
        </button>
        <button className="export-btn" onClick={resetComparison}>
          🔄 Reset Comparison
        </button>
      </div>

      <div className="comparison-footer">
        <p className="disclaimer">
          *Calculations are estimates. Actual loan terms may vary based on lender policies and credit assessment.
        </p>
      </div>
    </div>
  );
};

export default LoanComparison;