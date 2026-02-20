import React, { useState, useEffect } from 'react';

function LoanCalculator({ onApplyWithAmount }) {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(12.5);
  const [loanTerm, setLoanTerm] = useState(24);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    // Calculate monthly payment using loan amortization formula
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    let payment;
    if (monthlyRate === 0) {
      payment = principal / numberOfPayments;
    } else {
      payment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    setMonthlyPayment(payment);

    const total = payment * loanTerm;
    setTotalPayment(total);
    setTotalInterest(total - principal);
  }, [loanAmount, interestRate, loanTerm]);

  const formatCurrency = (value) => {
    return 'M ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="card">
      <h2 className="form-title">Loan Calculator</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Calculate your estimated monthly payments before applying
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label>Loan Amount: {formatCurrency(loanAmount)}</label>
          </div>
          <input
            type="range"
            min="1000"
            max="500000"
            step="1000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            style={{ width: '100%', height: '8px', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>M 1,000</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>M 500,000</span>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label>Interest Rate: {interestRate}%</label>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            style={{ width: '100%', height: '8px', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>5%</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>25%</span>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label>Loan Term: {loanTerm} months ({Math.floor(loanTerm/12)} years {loanTerm%12} months)</label>
          </div>
          <input
            type="range"
            min="6"
            max="60"
            step="6"
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
            style={{ width: '100%', height: '8px', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>6 months</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>60 months</span>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'linear-gradient(135deg, #f8f9fa, #fff)',
        padding: '2rem',
        borderRadius: '10px',
        border: '2px solid #FFB347',
        marginBottom: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Estimated Monthly Payment</p>
          <p style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#C41E3A',
            lineHeight: 1.2
          }}>
            {formatCurrency(monthlyPayment)}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '8px' }}>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>Total Interest</p>
            <p style={{ fontWeight: 'bold', color: '#FF6B35' }}>{formatCurrency(totalInterest)}</p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '8px' }}>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>Total Payment</p>
            <p style={{ fontWeight: 'bold', color: '#28a745' }}>{formatCurrency(totalPayment)}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button
          onClick={() => onApplyWithAmount(loanAmount)}
          style={{
            background: 'linear-gradient(135deg, #FF6B35, #C41E3A)',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Apply for This Amount
        </button>
        <button
          onClick={() => window.print()}
          style={{
            background: 'white',
            color: '#666',
            border: '2px solid #FFB347',
            padding: '1rem',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
        >
          Print Calculation
        </button>
      </div>
    </div>
  );
}

export default LoanCalculator;