import React, { useState, useEffect } from 'react';
import './LoanCalculator.css';

const LoanCalculator = ({ onCalculate }) => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(12.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateLoan = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Handle edge case where interest rate is 0
    if (monthlyRate === 0) {
      const monthlyPayment = principal / numberOfPayments;
      setCalculation({
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: principal.toFixed(2),
        totalInterest: '0.00',
        principal: principal
      });
      return;
    }
    
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    setCalculation({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: principal
    });

    if (onCalculate) {
      onCalculate({
        monthlyPayment,
        totalPayment,
        totalInterest
      });
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

  return (
    <div className="calculator-container">
      <h3>Loan Payment Calculator</h3>
      
      <div className="calculator-inputs">
        <div className="input-group">
          <label>Loan Amount (ZAR)</label>
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
          <div className="input-value">{formatCurrency(loanAmount)}</div>
        </div>

        <div className="input-group">
          <label>Interest Rate (%)</label>
          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
          <div className="input-value">{interestRate}%</div>
        </div>

        <div className="input-group">
          <label>Loan Term (Years)</label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
          />
          <div className="input-value">{loanTerm} years</div>
        </div>
      </div>

      {calculation && (
        <div className="calculator-results">
          <div className="result-card">
            <span className="result-label">Monthly Payment</span>
            <span className="result-value highlight">{formatCurrency(calculation.monthlyPayment)}</span>
          </div>
          
          <div className="result-row">
            <div className="result-card mini">
              <span className="result-label">Total Payment</span>
              <span className="result-value">{formatCurrency(calculation.totalPayment)}</span>
            </div>
            <div className="result-card mini">
              <span className="result-label">Total Interest</span>
              <span className="result-value">{formatCurrency(calculation.totalInterest)}</span>
            </div>
          </div>

          <div className="payment-breakdown">
            <h4>Payment Breakdown</h4>
            <div className="breakdown-bar">
              <div 
                className="breakdown-principal" 
                style={{width: `${(calculation.principal / calculation.totalPayment) * 100}%`}}
              >
                Principal
              </div>
              <div 
                className="breakdown-interest"
                style={{width: `${(calculation.totalInterest / calculation.totalPayment) * 100}%`}}
              >
                Interest
              </div>
            </div>
            <div className="breakdown-labels">
              <span>Principal: {formatCurrency(calculation.principal)}</span>
              <span>Interest: {formatCurrency(calculation.totalInterest)}</span>
            </div>
          </div>

          <button 
            className="apply-calculator"
            onClick={() => onCalculate && onCalculate(calculation)}
          >
            Apply These Figures
          </button>
        </div>
      )}
    </div>
  );
};

// Make sure to export default
export default LoanCalculator;