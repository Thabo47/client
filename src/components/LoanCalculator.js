import React, { useState, useEffect } from 'react';
import './LoanCalculator.css';

const LoanCalculator = ({ onCalculate, initialValues, embedded = false }) => {
  const [loanAmount, setLoanAmount] = useState(initialValues?.loanAmount || 250000);
  const [interestRate, setInterestRate] = useState(initialValues?.interestRate || 12.5);
  const [loanTerm, setLoanTerm] = useState(initialValues?.loanTerm || 5);
  const [calculation, setCalculation] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [extraPayment, setExtraPayment] = useState(0);
  const [affordabilityCheck, setAffordabilityCheck] = useState({
    monthlyIncome: initialValues?.monthlyIncome || 0,
    monthlyExpenses: initialValues?.monthlyExpenses || 0,
    existingDebt: initialValues?.existingDebt || 0
  });

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, extraPayment]);

  const calculateLoan = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Handle edge case where interest rate is 0
    if (monthlyRate === 0) {
      const monthlyPayment = principal / numberOfPayments;
      const calculationResult = {
        monthlyPayment: monthlyPayment,
        totalPayment: principal,
        totalInterest: 0,
        principal: principal,
        numberOfPayments: numberOfPayments
      };
      setCalculation(calculationResult);
      generateAmortizationSchedule(principal, 0, monthlyPayment, numberOfPayments, extraPayment);
      return;
    }
    
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    const calculationResult = {
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      principal: principal,
      numberOfPayments: numberOfPayments,
      interestRate: interestRate,
      loanTerm: loanTerm
    };
    
    setCalculation(calculationResult);
    generateAmortizationSchedule(principal, monthlyRate, monthlyPayment, numberOfPayments, extraPayment);

    if (onCalculate) {
      onCalculate(calculationResult);
    }
  };

  const generateAmortizationSchedule = (principal, monthlyRate, monthlyPayment, numPayments, extraPayment = 0) => {
    let balance = principal;
    const schedule = [];
    let totalInterestPaid = 0;
    let actualMonthlyPayment = monthlyPayment + extraPayment;
    
    for (let i = 1; i <= numPayments && balance > 0; i++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = actualMonthlyPayment - interestPayment;
      
      if (principalPayment > balance) {
        principalPayment = balance;
        actualMonthlyPayment = interestPayment + balance;
      }
      
      balance -= principalPayment;
      totalInterestPaid += interestPayment;
      
      schedule.push({
        month: i,
        payment: actualMonthlyPayment,
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        balance: Math.max(0, balance),
        totalInterestPaid: totalInterestPaid,
        year: Math.ceil(i / 12)
      });
      
      if (balance <= 0) break;
    }
    
    setAmortizationSchedule(schedule);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getAffordabilityStatus = () => {
    if (!calculation || !affordabilityCheck.monthlyIncome) return null;
    
    const monthlyPayment = calculation.monthlyPayment;
    const totalDebtObligations = monthlyPayment + 
      (affordabilityCheck.existingDebt / 12) + 
      affordabilityCheck.monthlyExpenses;
    
    const dtiRatio = (totalDebtObligations / affordabilityCheck.monthlyIncome) * 100;
    
    if (dtiRatio <= 30) return { status: 'excellent', text: 'Excellent', color: '#2ecc71' };
    if (dtiRatio <= 40) return { status: 'good', text: 'Good', color: '#27ae60' };
    if (dtiRatio <= 50) return { status: 'fair', text: 'Fair', color: '#f39c12' };
    return { status: 'poor', text: 'Poor', color: '#e74c3c' };
  };

  const getLoanDecision = () => {
    if (!calculation || !affordabilityCheck.monthlyIncome) return null;
    
    const dti = ((calculation.monthlyPayment + 
      (affordabilityCheck.existingDebt / 12) + 
      affordabilityCheck.monthlyExpenses) / affordabilityCheck.monthlyIncome) * 100;
    
    // Prolog-like decision logic
    if (dti < 40 && calculation.monthlyPayment < affordabilityCheck.monthlyIncome * 0.3) {
      return { decision: 'approved', class: 'badge-approved', text: '✓ APPROVED' };
    } else if (dti < 50 && calculation.monthlyPayment < affordabilityCheck.monthlyIncome * 0.4) {
      return { decision: 'conditional', class: 'badge-conditional', text: '⚠️ CONDITIONAL' };
    } else {
      return { decision: 'rejected', class: 'badge-rejected', text: '✗ REJECTED' };
    }
  };

  const affordabilityStatus = getAffordabilityStatus();
  const loanDecision = getLoanDecision();

  return (
    <div className={`calculator-container ${embedded ? 'embedded' : ''}`}>
      <div className="calculator-header">
        <h3>🏦 Loan Calculator & Simulator</h3>
        <p>Calculate your monthly payments and see loan affordability</p>
      </div>

      <div className="calculator-tabs">
        <button 
          className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          📊 Calculator
        </button>
        <button 
          className={`tab-btn ${activeTab === 'amortization' ? 'active' : ''}`}
          onClick={() => setActiveTab('amortization')}
          disabled={!calculation}
        >
          📈 Amortization Schedule
        </button>
        <button 
          className={`tab-btn ${activeTab === 'affordability' ? 'active' : ''}`}
          onClick={() => setActiveTab('affordability')}
        >
          💰 Affordability Check
        </button>
      </div>

      {activeTab === 'calculator' && (
        <>
          <div className="calculator-inputs">
            <div className="input-group">
              <label>
                Loan Amount
                <span className="input-range">{formatCurrency(loanAmount)}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="amount-slider"
              />
              <div className="input-presets">
                <button onClick={() => setLoanAmount(50000)}>R50k</button>
                <button onClick={() => setLoanAmount(100000)}>R100k</button>
                <button onClick={() => setLoanAmount(250000)}>R250k</button>
                <button onClick={() => setLoanAmount(500000)}>R500k</button>
                <button onClick={() => setLoanAmount(750000)}>R750k</button>
              </div>
            </div>

            <div className="input-group">
              <label>
                Interest Rate (%)
                <span className="input-range">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="rate-slider"
              />
              <div className="input-presets">
                <button onClick={() => setInterestRate(8.5)}>8.5%</button>
                <button onClick={() => setInterestRate(10.5)}>10.5%</button>
                <button onClick={() => setInterestRate(12.5)}>12.5%</button>
                <button onClick={() => setInterestRate(15.0)}>15%</button>
                <button onClick={() => setInterestRate(18.5)}>18.5%</button>
              </div>
            </div>

            <div className="input-group">
              <label>
                Loan Term (Years)
                <span className="input-range">{loanTerm} years</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="term-slider"
              />
              <div className="input-presets">
                <button onClick={() => setLoanTerm(1)}>1 year</button>
                <button onClick={() => setLoanTerm(3)}>3 years</button>
                <button onClick={() => setLoanTerm(5)}>5 years</button>
                <button onClick={() => setLoanTerm(10)}>10 years</button>
                <button onClick={() => setLoanTerm(20)}>20 years</button>
              </div>
            </div>

            <button 
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▼ Hide Advanced' : '▶ Show Advanced Options'}
            </button>

            {showAdvanced && (
              <div className="advanced-inputs">
                <div className="input-group">
                  <label>
                    Extra Monthly Payment
                    <span className="input-range">{formatCurrency(extraPayment)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={calculation?.monthlyPayment ? calculation.monthlyPayment * 2 : 10000}
                    step="100"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    className="extra-slider"
                  />
                  <p className="advanced-hint">
                    Extra payments reduce total interest and loan term
                  </p>
                </div>
              </div>
            )}
          </div>

          {calculation && (
            <div className="calculator-results">
              <div className="results-grid">
                <div className="result-card main">
                  <span className="result-label">Monthly Payment</span>
                  <span className="result-value highlight">{formatCurrency(calculation.monthlyPayment)}</span>
                  {extraPayment > 0 && (
                    <span className="result-note">
                      + {formatCurrency(extraPayment)} extra = {formatCurrency(calculation.monthlyPayment + extraPayment)}
                    </span>
                  )}
                </div>
                
                <div className="result-row">
                  <div className="result-card">
                    <span className="result-label">Total Payment</span>
                    <span className="result-value">{formatCurrency(calculation.totalPayment)}</span>
                  </div>
                  <div className="result-card">
                    <span className="result-label">Total Interest</span>
                    <span className="result-value">{formatCurrency(calculation.totalInterest)}</span>
                  </div>
                </div>

                <div className="result-card summary">
                  <div className="summary-item">
                    <span>Principal:</span>
                    <strong>{formatCurrency(calculation.principal)}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Interest:</span>
                    <strong>{formatCurrency(calculation.totalInterest)}</strong>
                  </div>
                  <div className="summary-item total">
                    <span>Total Cost:</span>
                    <strong>{formatCurrency(calculation.totalPayment)}</strong>
                  </div>
                </div>
              </div>

              <div className="payment-breakdown">
                <h4>Payment Distribution</h4>
                <div className="breakdown-visual">
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-principal" 
                      style={{width: `${(calculation.principal / calculation.totalPayment) * 100}%`}}
                    >
                      <span>Principal {Math.round((calculation.principal / calculation.totalPayment) * 100)}%</span>
                    </div>
                    <div 
                      className="breakdown-interest"
                      style={{width: `${(calculation.totalInterest / calculation.totalPayment) * 100}%`}}
                    >
                      <span>Interest {Math.round((calculation.totalInterest / calculation.totalPayment) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {extraPayment > 0 && (
                <div className="extra-payment-benefits">
                  <h4>Extra Payment Benefits</h4>
                  <div className="benefits-grid">
                    <div className="benefit-card">
                      <span className="benefit-icon">⏱️</span>
                      <span className="benefit-label">Time Saved</span>
                      <span className="benefit-value">
                        {Math.round(amortizationSchedule.length / 12)} years
                      </span>
                    </div>
                    <div className="benefit-card">
                      <span className="benefit-icon">💰</span>
                      <span className="benefit-label">Interest Saved</span>
                      <span className="benefit-value">
                        {formatCurrency(calculation.totalInterest - 
                          amortizationSchedule[amortizationSchedule.length - 1]?.totalInterestPaid)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                className="apply-calculator"
                onClick={() => onCalculate && onCalculate({
                  ...calculation,
                  loanAmount,
                  interestRate,
                  loanTerm
                })}
              >
                Apply to Loan Application
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'amortization' && calculation && (
        <div className="amortization-content">
          <h4>Amortization Schedule</h4>
          <p className="schedule-info">
            Showing first 12 months of {calculation.numberOfPayments} total payments
          </p>
          
          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.slice(0, 12).map((row, index) => (
                  <tr key={index}>
                    <td>{row.month}</td>
                    <td>{row.year}</td>
                    <td>{formatCurrency(row.payment)}</td>
                    <td className="principal-cell">{formatCurrency(row.principalPayment)}</td>
                    <td className="interest-cell">{formatCurrency(row.interestPayment)}</td>
                    <td>{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="amortization-summary">
            <div className="summary-stat">
              <span>Loan Term with Extra Payments:</span>
              <strong>{Math.ceil(amortizationSchedule.length / 12)} years</strong>
            </div>
            <div className="summary-stat">
              <span>Total Interest Paid:</span>
              <strong>{formatCurrency(amortizationSchedule[amortizationSchedule.length - 1]?.totalInterestPaid)}</strong>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'affordability' && (
        <div className="affordability-content">
          <h4>Affordability Check</h4>
          
          <div className="affordability-inputs">
            <div className="input-group">
              <label>Monthly Income (After Tax)</label>
              <input
                type="number"
                value={affordabilityCheck.monthlyIncome}
                onChange={(e) => setAffordabilityCheck({
                  ...affordabilityCheck,
                  monthlyIncome: Number(e.target.value)
                })}
                placeholder="Enter monthly income"
                min="0"
                step="1000"
              />
            </div>

            <div className="input-group">
              <label>Monthly Expenses</label>
              <input
                type="number"
                value={affordabilityCheck.monthlyExpenses}
                onChange={(e) => setAffordabilityCheck({
                  ...affordabilityCheck,
                  monthlyExpenses: Number(e.target.value)
                })}
                placeholder="Enter monthly expenses"
                min="0"
                step="100"
              />
            </div>

            <div className="input-group">
              <label>Existing Monthly Debt Payments</label>
              <input
                type="number"
                value={affordabilityCheck.existingDebt / 12}
                onChange={(e) => setAffordabilityCheck({
                  ...affordabilityCheck,
                  existingDebt: Number(e.target.value) * 12
                })}
                placeholder="Enter monthly debt payments"
                min="0"
                step="100"
              />
            </div>
          </div>

          {calculation && affordabilityCheck.monthlyIncome > 0 && (
            <div className="affordability-results">
              <div className={`affordability-status ${affordabilityStatus?.status}`}>
                <div className="status-indicator" style={{backgroundColor: affordabilityStatus?.color}}>
                  {affordabilityStatus?.text}
                </div>
              </div>

              {loanDecision && (
                <div className="loan-decision">
                  <span className={loanDecision.class}>{loanDecision.text}</span>
                </div>
              )}

              <div className="affordability-metrics">
                <div className="metric">
                  <span className="metric-label">Proposed Monthly Payment:</span>
                  <span className="metric-value">{formatCurrency(calculation.monthlyPayment)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Total Monthly Obligations:</span>
                  <span className="metric-value">
                    {formatCurrency(calculation.monthlyPayment + 
                      affordabilityCheck.monthlyExpenses + 
                      (affordabilityCheck.existingDebt / 12))}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Debt-to-Income Ratio:</span>
                  <span className="metric-value" style={{color: affordabilityStatus?.color}}>
                    {((calculation.monthlyPayment + 
                       affordabilityCheck.monthlyExpenses + 
                       (affordabilityCheck.existingDebt / 12)) / 
                       affordabilityCheck.monthlyIncome * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Remaining Disposable Income:</span>
                  <span className="metric-value">
                    {formatCurrency(affordabilityCheck.monthlyIncome - 
                      (calculation.monthlyPayment + 
                       affordabilityCheck.monthlyExpenses + 
                       (affordabilityCheck.existingDebt / 12)))}
                  </span>
                </div>
              </div>

              <div className="dti-scale">
                <div className="scale-labels">
                  <span>Excellent</span>
                  <span>Good</span>
                  <span>Fair</span>
                  <span>Poor</span>
                </div>
                <div className="scale-bar">
                  <div className="scale-segment excellent"></div>
                  <div className="scale-segment good"></div>
                  <div className="scale-segment fair"></div>
                  <div className="scale-segment poor"></div>
                  <div 
                    className="dti-marker"
                    style={{
                      left: `${Math.min(((calculation.monthlyPayment + 
                        affordabilityCheck.monthlyExpenses + 
                        (affordabilityCheck.existingDebt / 12)) / 
                        affordabilityCheck.monthlyIncome * 100), 100)}%`
                    }}
                  >
                    ▲
                  </div>
                </div>
              </div>

              {/* Prolog-style decision explanation */}
              <div className="decision-explanation">
                <h5>📋 Decision Explanation:</h5>
                <ul>
                  {affordabilityStatus?.status === 'excellent' && (
                    <li>✓ Excellent debt-to-income ratio</li>
                  )}
                  {affordabilityStatus?.status === 'good' && (
                    <li>✓ Good debt-to-income ratio</li>
                  )}
                  {affordabilityStatus?.status === 'fair' && (
                    <li>⚠️ Fair debt-to-income ratio - may need review</li>
                  )}
                  {affordabilityStatus?.status === 'poor' && (
                    <li>❌ Poor debt-to-income ratio - high risk</li>
                  )}
                  {calculation.monthlyPayment < affordabilityCheck.monthlyIncome * 0.3 ? (
                    <li>✓ Monthly payment is within recommended range</li>
                  ) : (
                    <li>⚠️ Monthly payment exceeds recommended 30% of income</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="calculator-footer">
        <p className="disclaimer">
          *This is an estimate. Actual loan terms may vary based on credit assessment and lender policies.
        </p>
      </div>
    </div>
  );
};

export default LoanCalculator;