import React, { useState } from 'react';

function LoanComparison({ onSelectLoan }) {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanPurpose, setLoanPurpose] = useState('personal');

  const loanProducts = [
    {
      name: 'Personal Loan',
      interestRate: 12.5,
      processingFee: 1.5,
      minAmount: 1000,
      maxAmount: 100000,
      minTerm: 6,
      maxTerm: 36,
      description: 'Flexible loan for personal expenses, debt consolidation, or emergencies',
      features: ['No collateral required', 'Quick approval', 'Flexible repayment terms']
    },
    {
      name: 'Business Loan',
      interestRate: 10.5,
      processingFee: 2.0,
      minAmount: 5000,
      maxAmount: 500000,
      minTerm: 12,
      maxTerm: 60,
      description: 'Grow your business with competitive rates and flexible terms',
      features: ['Business expansion', 'Equipment purchase', 'Working capital']
    },
    {
      name: 'Home Improvement Loan',
      interestRate: 9.5,
      processingFee: 1.0,
      minAmount: 10000,
      maxAmount: 300000,
      minTerm: 12,
      maxTerm: 84,
      description: 'Renovate or repair your home with affordable monthly payments',
      features: ['Renovations', 'Repairs', 'Extensions']
    },
    {
      name: 'Education Loan',
      interestRate: 8.5,
      processingFee: 1.0,
      minAmount: 5000,
      maxAmount: 200000,
      minTerm: 12,
      maxTerm: 96,
      description: 'Invest in your future with education financing',
      features: ['Tuition fees', 'Course materials', 'Living expenses']
    }
  ];

  const calculateMonthlyPayment = (principal, rate, term) => {
    const monthlyRate = rate / 100 / 12;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, term) / 
           (Math.pow(1 + monthlyRate, term) - 1);
  };

  const calculateTotalInterest = (principal, rate, term) => {
    const monthlyPayment = calculateMonthlyPayment(principal, rate, term);
    return (monthlyPayment * term) - principal;
  };

  const formatCurrency = (value) => {
    return 'M ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const filteredProducts = loanProducts.filter(product => 
    loanAmount >= product.minAmount && loanAmount <= product.maxAmount
  );

  return (
    <div className="card">
      <h2 className="form-title">Compare Loan Options</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Find the best loan product for your needs
      </p>

      <div style={{ 
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '10px',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Loan Amount</label>
          <input
            type="range"
            min="1000"
            max="500000"
            step="1000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            style={{ width: '100%', height: '8px', borderRadius: '4px' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '0.5rem',
            fontWeight: 'bold',
            color: '#C41E3A'
          }}>
            <span>{formatCurrency(1000)}</span>
            <span>{formatCurrency(loanAmount)}</span>
            <span>{formatCurrency(500000)}</span>
          </div>
        </div>

        <div>
          <label>Loan Purpose</label>
          <select
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '8px',
              border: '2px solid #FF8C5A'
            }}
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="home">Home Improvement</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            No products available for M {loanAmount.toLocaleString()}
          </p>
          <p style={{ color: '#666' }}>
            Try adjusting your loan amount or contact us for custom solutions
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredProducts.map((product, index) => {
            const monthlyPayment = calculateMonthlyPayment(
              loanAmount, 
              product.interestRate, 
              product.minTerm
            );
            const totalInterest = calculateTotalInterest(
              loanAmount,
              product.interestRate,
              product.minTerm
            );

            return (
              <div
                key={product.name}
                style={{
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '10px',
                  border: `2px solid ${index === 0 ? '#FF6B35' : '#FFB347'}`,
                  boxShadow: index === 0 ? '0 5px 20px rgba(255, 107, 53, 0.2)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {index === 0 && (
                  <div style={{
                    background: '#FF6B35',
                    color: 'white',
                    padding: '0.3rem 1rem',
                    borderRadius: '20px',
                    display: 'inline-block',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    Best Match
                  </div>
                )}

                <h3 style={{ color: '#C41E3A', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                  {product.name}
                </h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  {product.description}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Interest Rate</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {product.interestRate}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Monthly Payment</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#FF6B35' }}>
                      {formatCurrency(monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Total Interest</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {formatCurrency(totalInterest)}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#C41E3A' }}>
                    Key Features:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {product.features.map((feature, i) => (
                      <li key={i} style={{ margin: '0.3rem 0', color: '#666' }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>Loan Range: </span>
                    <strong>{formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}</strong>
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>Terms: </span>
                    <strong>{product.minTerm} - {product.maxTerm} months</strong>
                  </div>
                </div>

                <button
                  onClick={() => onSelectLoan(product, loanAmount)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: index === 0 ? 'linear-gradient(135deg, #FF6B35, #C41E3A)' : 'white',
                    color: index === 0 ? 'white' : '#C41E3A',
                    border: index === 0 ? 'none' : '2px solid #FF6B35',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (index !== 0) {
                      e.target.style.background = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== 0) {
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  Select This Loan
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LoanComparison;