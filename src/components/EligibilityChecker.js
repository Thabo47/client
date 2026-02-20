import React, { useState } from 'react';

function EligibilityChecker({ onProceedToApplication }) {
  const [income, setIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [age, setAge] = useState('');
  const [employment, setEmployment] = useState('');
  const [checkResult, setCheckResult] = useState(null);

  const checkEligibility = () => {
    let score = 0;
    const feedback = [];

    // Age check
    if (parseInt(age) >= 18 && parseInt(age) <= 70) {
      score += 25;
      feedback.push({ criteria: 'Age requirement', status: 'passed' });
    } else {
      feedback.push({ criteria: 'Age requirement', status: 'failed' });
    }

    // Income check (minimum M 2000 per month)
    if (parseFloat(income) >= 2000) {
      score += 25;
      feedback.push({ criteria: 'Minimum income (M 2,000)', status: 'passed' });
    } else {
      feedback.push({ criteria: 'Minimum income (M 2,000)', status: 'failed' });
    }

    // Credit score check
    if (parseInt(creditScore) >= 600) {
      score += 25;
      feedback.push({ criteria: 'Credit score (600+)', status: 'passed' });
    } else {
      feedback.push({ criteria: 'Credit score (600+)', status: 'failed' });
    }

    // Employment check
    if (employment === 'full_time' || employment === 'part_time' || employment === 'self_employed') {
      score += 25;
      feedback.push({ criteria: 'Employment status', status: 'passed' });
    } else {
      feedback.push({ criteria: 'Employment status', status: 'failed' });
    }

    let eligibility = '';
    let color = '';
    let message = '';

    if (score === 100) {
      eligibility = 'Highly Eligible';
      color = '#28a745';
      message = 'You meet all basic criteria. You can proceed with your application.';
    } else if (score >= 75) {
      eligibility = 'Moderately Eligible';
      color = '#ffc107';
      message = 'You meet most criteria. You may qualify with some conditions.';
    } else if (score >= 50) {
      eligibility = 'Marginally Eligible';
      color = '#FF8C5A';
      message = 'You meet some criteria. Your application may require additional review.';
    } else {
      eligibility = 'Low Eligibility';
      color = '#dc3545';
      message = 'You do not meet minimum criteria at this time.';
    }

    setCheckResult({
      score,
      eligibility,
      color,
      message,
      feedback
    });
  };

  return (
    <div className="card">
      <h2 className="form-title">Quick Eligibility Checker</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Check if you meet the basic requirements before applying
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Your Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            placeholder="Enter your age"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #FF8C5A' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Monthly Income (M)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value))}
            placeholder="Enter monthly income"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #FF8C5A' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Credit Score</label>
          <input
            type="number"
            value={creditScore}
            onChange={(e) => setCreditScore(parseInt(e.target.value))}
            placeholder="Enter credit score"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #FF8C5A' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Employment Status</label>
          <select
            value={employment}
            onChange={(e) => setEmployment(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #FF8C5A' }}
          >
            <option value="">Select status</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="self_employed">Self Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <button
          onClick={checkEligibility}
          disabled={!income || !creditScore || !age || !employment}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #FF6B35, #C41E3A)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: (!income || !creditScore || !age || !employment) ? 0.5 : 1
          }}
        >
          Check Eligibility
        </button>
      </div>

      {checkResult && (
        <div style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '10px',
          border: `2px solid ${checkResult.color}`,
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Your Eligibility Score</p>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: checkResult.color }}>
              {checkResult.score}%
            </p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: checkResult.color 
            }}>
              {checkResult.eligibility}
            </p>
          </div>

          <p style={{ 
            textAlign: 'center', 
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '8px'
          }}>
            {checkResult.message}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#C41E3A' }}>
              Criteria Breakdown:
            </p>
            {checkResult.feedback.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '0.8rem',
                  margin: '0.5rem 0',
                  background: 'white',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{item.criteria}</span>
                <span style={{
                  color: item.status === 'passed' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {item.status === 'passed' ? '✓ Passed' : '✗ Failed'}
                </span>
              </div>
            ))}
          </div>

          {checkResult.score >= 50 && (
            <button
              onClick={onProceedToApplication}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #FF6B35, #C41E3A)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Proceed to Full Application
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EligibilityChecker;