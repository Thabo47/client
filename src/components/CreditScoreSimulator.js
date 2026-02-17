import React, { useState } from 'react';
import './CreditScoreSimulator.css';

const CreditScoreSimulator = ({ onScoreChange }) => {
  const [factors, setFactors] = useState({
    paymentHistory: 70,
    creditUtilization: 50,
    creditAge: 40,
    creditMix: 50,
    newInquiries: 30
  });

  const calculateScore = () => {
    const weights = {
      paymentHistory: 0.35,
      creditUtilization: 0.30,
      creditAge: 0.15,
      creditMix: 0.10,
      newInquiries: 0.10
    };

    const score = Object.keys(factors).reduce((total, factor) => {
      return total + (factors[factor] * weights[factor]);
    }, 300);

    return Math.min(850, Math.max(300, Math.round(score * 5.5 + 300)));
  };

  const handleFactorChange = (factor, value) => {
    setFactors(prev => ({
      ...prev,
      [factor]: value
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 750) return '#52c41a';
    if (score >= 700) return '#faad14';
    if (score >= 600) return '#fa8c16';
    return '#f5222d';
  };

  const getScoreMessage = (score) => {
    if (score >= 750) return 'Excellent! You qualify for our best rates.';
    if (score >= 700) return 'Good - You have a solid credit profile.';
    if (score >= 650) return 'Fair - Some room for improvement.';
    return 'Poor - Let\'s work on improving this.';
  };

  const getFactorTip = (factor) => {
    const tips = {
      paymentHistory: 'Pay all bills on time. Even one late payment can drop your score significantly.',
      creditUtilization: 'Keep credit card balances below 30% of your limit.',
      creditAge: 'Keep old accounts open to maintain credit history length.',
      creditMix: 'Having different types of credit (cards, loans) can help.',
      newInquiries: 'Limit new credit applications to avoid hard inquiries.'
    };
    return tips[factor];
  };

  const currentScore = calculateScore();
  const scoreColor = getScoreColor(currentScore);

  return (
    <div className="simulator-container">
      <h3>Credit Score Simulator</h3>
      <p className="simulator-subtitle">Adjust the factors below to see how they affect your credit score</p>

      <div className="score-display">
        <div className="score-circle" style={{ borderColor: scoreColor }}>
          <span className="score-number">{currentScore}</span>
          <span className="score-range">out of 850</span>
        </div>
        <div className="score-message" style={{ color: scoreColor }}>
          {getScoreMessage(currentScore)}
        </div>
      </div>

      <div className="factors-list">
        {Object.entries(factors).map(([factor, value]) => (
          <div key={factor} className="factor-item">
            <div className="factor-header">
              <span className="factor-name">
                {factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="factor-value">{value}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleFactorChange(factor, Number(e.target.value))}
              className="factor-slider"
            />
            <p className="factor-tip">{getFactorTip(factor)}</p>
          </div>
        ))}
      </div>

      <div className="simulator-actions">
        <button 
          className="apply-score"
          onClick={() => onScoreChange && onScoreChange(currentScore)}
        >
          Apply This Score
        </button>
        <button 
          className="reset-score"
          onClick={() => setFactors({
            paymentHistory: 70,
            creditUtilization: 50,
            creditAge: 40,
            creditMix: 50,
            newInquiries: 30
          })}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CreditScoreSimulator;