import React, { useState, useEffect } from 'react';
import './CreditScoreSimulator.css';

const CreditScoreSimulator = ({ onSimulationComplete }) => {
  const [simulationData, setSimulationData] = useState({
    currentScore: 650,
    paymentHistory: 85,
    creditUtilization: 45,
    creditAge: 5,
    recentInquiries: 2,
    debtAmount: 25000,
    income: 50000
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [activeTab, setActiveTab] = useState('simulator');
  const [recommendations, setRecommendations] = useState([]);
  const [loanEligibility, setLoanEligibility] = useState({
    eligible: false,
    maxLoan: 0,
    interestRate: 0,
    decision: 'unknown'
  });

  // Calculate impact of changes on credit score
  const calculateScoreImpact = () => {
    let score = simulationData.currentScore;
    const impacts = [];

    // Payment History Impact (35% of score)
    const paymentImpact = Math.round((simulationData.paymentHistory - 85) * 2.5);
    score += paymentImpact;
    if (paymentImpact !== 0) {
      impacts.push({
        factor: 'Payment History',
        change: paymentImpact,
        description: paymentImpact > 0 ? 'Improved payment history' : 'Payment issues detected'
      });
    }

    // Credit Utilization Impact (30% of score)
    const utilizationImpact = Math.round((45 - simulationData.creditUtilization) * 1.8);
    score += utilizationImpact;
    if (utilizationImpact !== 0) {
      impacts.push({
        factor: 'Credit Utilization',
        change: utilizationImpact,
        description: utilizationImpact > 0 ? 'Lower utilization helps' : 'High utilization hurts'
      });
    }

    // Credit Age Impact (15% of score)
    const ageImpact = Math.round((simulationData.creditAge - 5) * 3);
    score += ageImpact;
    if (ageImpact !== 0) {
      impacts.push({
        factor: 'Credit History Age',
        change: ageImpact,
        description: ageImpact > 0 ? 'Longer history builds trust' : 'Young credit profile'
      });
    }

    // Recent Inquiries Impact (10% of score)
    const inquiryImpact = Math.round((2 - simulationData.recentInquiries) * 5);
    score += inquiryImpact;
    if (inquiryImpact !== 0) {
      impacts.push({
        factor: 'Recent Inquiries',
        change: inquiryImpact,
        description: inquiryImpact > 0 ? 'Fewer inquiries is better' : 'Multiple recent inquiries'
      });
    }

    // Debt-to-Income Impact
    const dti = (simulationData.debtAmount / simulationData.income) * 100;
    const dtiImpact = dti > 40 ? -30 : dti > 30 ? -15 : dti > 20 ? -5 : 10;
    score += dtiImpact;

    // Ensure score stays within valid range
    score = Math.min(850, Math.max(300, Math.round(score)));

    return { score, impacts };
  };

  // Generate recommendations based on current data
  const generateRecommendations = () => {
    const recs = [];

    if (simulationData.paymentHistory < 95) {
      recs.push({
        priority: 'high',
        title: 'Improve Payment History',
        description: 'Set up automatic payments to avoid missing due dates',
        impact: '+35-50 points',
        timeframe: '3-6 months',
        action: 'Pay all bills on time for the next 6 months'
      });
    }

    if (simulationData.creditUtilization > 30) {
      recs.push({
        priority: 'high',
        title: 'Reduce Credit Utilization',
        description: 'Try to keep credit card balances below 30% of your limit',
        impact: '+20-40 points',
        timeframe: '1-2 months',
        action: 'Pay down credit card balances or request credit limit increase'
      });
    }

    const dti = (simulationData.debtAmount / simulationData.income) * 100;
    if (dti > 36) {
      recs.push({
        priority: 'medium',
        title: 'Lower Debt-to-Income Ratio',
        description: 'High DTI ratio affects loan eligibility',
        impact: '+15-25 points',
        timeframe: '6-12 months',
        action: 'Pay down existing debt or increase income'
      });
    }

    if (simulationData.recentInquiries > 2) {
      recs.push({
        priority: 'medium',
        title: 'Limit New Credit Applications',
        description: 'Multiple inquiries can lower your score',
        impact: '+5-10 points',
        timeframe: '6 months',
        action: 'Avoid applying for new credit for 6 months'
      });
    }

    if (simulationData.creditAge < 3) {
      recs.push({
        priority: 'low',
        title: 'Build Credit History',
        description: 'Young credit profiles need time to mature',
        impact: '+10-20 points',
        timeframe: '12-24 months',
        action: 'Keep oldest accounts open and active'
      });
    }

    return recs;
  };

  // Check loan eligibility based on simulated score
  const checkLoanEligibility = (score, dti) => {
    let eligible = false;
    let maxLoan = 0;
    let interestRate = 0;
    let decision = 'unknown';

    // Prolog-like rules for loan decision
    if (score >= 700 && dti < 40) {
      eligible = true;
      maxLoan = Math.round(simulationData.income * 5);
      interestRate = 8.5;
      decision = 'approved';
    } else if (score >= 650 && dti < 45) {
      eligible = true;
      maxLoan = Math.round(simulationData.income * 3);
      interestRate = 12.5;
      decision = 'conditional';
    } else if (score >= 600 && dti < 50) {
      eligible = true;
      maxLoan = Math.round(simulationData.income * 2);
      interestRate = 16.5;
      decision = 'conditional';
    } else {
      eligible = false;
      maxLoan = 0;
      interestRate = 0;
      decision = 'rejected';
    }

    return { eligible, maxLoan, interestRate, decision };
  };

  // Update simulation on data change
  useEffect(() => {
    const { score, impacts } = calculateScoreImpact();
    const dti = (simulationData.debtAmount / simulationData.income) * 100;
    const eligibility = checkLoanEligibility(score, dti);
    
    setSimulationResult({
      projectedScore: score,
      scoreChange: score - simulationData.currentScore,
      impacts: impacts
    });

    setLoanEligibility(eligibility);
    setRecommendations(generateRecommendations());
  }, [simulationData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSimulationData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const getScoreCategory = (score) => {
    if (score >= 750) return { category: 'Excellent', color: '#2ecc71', emoji: '🌟' };
    if (score >= 700) return { category: 'Good', color: '#27ae60', emoji: '✅' };
    if (score >= 650) return { category: 'Fair', color: '#f39c12', emoji: '⚠️' };
    if (score >= 600) return { category: 'Poor', color: '#e67e22', emoji: '📉' };
    return { category: 'Very Poor', color: '#e74c3c', emoji: '❌' };
  };

  const getDecisionBadge = (decision) => {
    switch(decision) {
      case 'approved':
        return { text: '✓ APPROVED', class: 'badge-approved' };
      case 'conditional':
        return { text: '⚠️ CONDITIONAL', class: 'badge-conditional' };
      case 'rejected':
        return { text: '✗ REJECTED', class: 'badge-rejected' };
      default:
        return { text: 'Unknown', class: '' };
    }
  };

  const applyScenario = (scenario) => {
    switch(scenario) {
      case 'excellent':
        setSimulationData({
          currentScore: 780,
          paymentHistory: 100,
          creditUtilization: 15,
          creditAge: 12,
          recentInquiries: 0,
          debtAmount: 15000,
          income: 75000
        });
        break;
      case 'average':
        setSimulationData({
          currentScore: 650,
          paymentHistory: 85,
          creditUtilization: 45,
          creditAge: 5,
          recentInquiries: 2,
          debtAmount: 25000,
          income: 50000
        });
        break;
      case 'poor':
        setSimulationData({
          currentScore: 550,
          paymentHistory: 70,
          creditUtilization: 85,
          creditAge: 2,
          recentInquiries: 5,
          debtAmount: 45000,
          income: 40000
        });
        break;
    }
  };

  const decisionBadge = getDecisionBadge(loanEligibility.decision);
  const scoreCategory = simulationResult ? getScoreCategory(simulationResult.projectedScore) : null;

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <h2>🎯 Credit Score Simulator</h2>
        <p>See how changes in your financial behavior affect your credit score and loan eligibility</p>
      </div>

      {/* Scenario Buttons */}
      <div className="scenario-buttons">
        <button className="scenario-btn excellent" onClick={() => applyScenario('excellent')}>
          🌟 Excellent Credit
        </button>
        <button className="scenario-btn average" onClick={() => applyScenario('average')}>
          📊 Average Credit
        </button>
        <button className="scenario-btn poor" onClick={() => applyScenario('poor')}>
          📉 Poor Credit
        </button>
      </div>

      {/* Tabs */}
      <div className="simulator-tabs">
        <button 
          className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          🎮 Simulator
        </button>
        <button 
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          💡 Recommendations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('eligibility')}
        >
          🏦 Loan Eligibility
        </button>
      </div>

      {activeTab === 'simulator' && (
        <div className="simulator-content">
          {/* Score Display */}
          <div className="score-display">
            <div className="current-score">
              <span className="score-label">Current Score</span>
              <span className="score-value">{simulationData.currentScore}</span>
            </div>
            <div className="score-arrow">
              {simulationResult && simulationResult.scoreChange > 0 ? '→ ↗' : 
               simulationResult && simulationResult.scoreChange < 0 ? '→ ↘' : '→'}
            </div>
            <div className="projected-score" style={{ color: scoreCategory?.color }}>
              <span className="score-label">Projected Score</span>
              <span className="score-value">{simulationResult?.projectedScore}</span>
              <span className="score-change">
                {simulationResult && simulationResult.scoreChange > 0 ? `+${simulationResult.scoreChange}` : 
                 simulationResult && simulationResult.scoreChange < 0 ? simulationResult.scoreChange : ''}
              </span>
            </div>
          </div>

          {/* Score Category */}
          {scoreCategory && (
            <div className="score-category" style={{ backgroundColor: scoreCategory.color + '20' }}>
              <span className="category-emoji">{scoreCategory.emoji}</span>
              <span className="category-text">{scoreCategory.category}</span>
            </div>
          )}

          {/* Sliders */}
          <div className="sliders-grid">
            <div className="slider-group">
              <label>
                Payment History: {simulationData.paymentHistory}%
                <small>35% of your score</small>
              </label>
              <input
                type="range"
                name="paymentHistory"
                min="0"
                max="100"
                value={simulationData.paymentHistory}
                onChange={handleInputChange}
                className="slider payment-slider"
              />
              <div className="slider-labels">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="slider-group">
              <label>
                Credit Utilization: {simulationData.creditUtilization}%
                <small>30% of your score</small>
              </label>
              <input
                type="range"
                name="creditUtilization"
                min="0"
                max="100"
                value={simulationData.creditUtilization}
                onChange={handleInputChange}
                className="slider utilization-slider"
              />
              <div className="slider-labels">
                <span>High (Bad)</span>
                <span>Low (Good)</span>
              </div>
            </div>

            <div className="slider-group">
              <label>
                Credit History Age: {simulationData.creditAge} years
                <small>15% of your score</small>
              </label>
              <input
                type="range"
                name="creditAge"
                min="0"
                max="25"
                step="0.5"
                value={simulationData.creditAge}
                onChange={handleInputChange}
                className="slider age-slider"
              />
              <div className="slider-labels">
                <span>New</span>
                <span>Established</span>
              </div>
            </div>

            <div className="slider-group">
              <label>
                Recent Inquiries: {simulationData.recentInquiries}
                <small>10% of your score</small>
              </label>
              <input
                type="range"
                name="recentInquiries"
                min="0"
                max="10"
                value={simulationData.recentInquiries}
                onChange={handleInputChange}
                className="slider inquiry-slider"
              />
              <div className="slider-labels">
                <span>Many (Bad)</span>
                <span>Few (Good)</span>
              </div>
            </div>

            <div className="slider-group">
              <label>
                Total Debt: R {simulationData.debtAmount.toLocaleString()}
                <small>Affects DTI ratio</small>
              </label>
              <input
                type="range"
                name="debtAmount"
                min="0"
                max="100000"
                step="1000"
                value={simulationData.debtAmount}
                onChange={handleInputChange}
                className="slider debt-slider"
              />
            </div>

            <div className="slider-group">
              <label>
                Annual Income: R {simulationData.income.toLocaleString()}
                <small>Affects borrowing power</small>
              </label>
              <input
                type="range"
                name="income"
                min="20000"
                max="200000"
                step="1000"
                value={simulationData.income}
                onChange={handleInputChange}
                className="slider income-slider"
              />
            </div>
          </div>

          {/* Impact Analysis */}
          {simulationResult && simulationResult.impacts.length > 0 && (
            <div className="impact-analysis">
              <h3>📈 Impact Analysis</h3>
              <div className="impacts-list">
                {simulationResult.impacts.map((impact, index) => (
                  <div key={index} className="impact-item">
                    <span className="impact-factor">{impact.factor}</span>
                    <span className={`impact-change ${impact.change > 0 ? 'positive' : 'negative'}`}>
                      {impact.change > 0 ? `+${impact.change}` : impact.change}
                    </span>
                    <span className="impact-description">{impact.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="recommendations-content">
          <h3>💡 Personalized Recommendations</h3>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                <div className="recommendation-header">
                  <span className="priority-badge">{rec.priority.toUpperCase()}</span>
                  <span className="impact-badge">{rec.impact}</span>
                </div>
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
                <div className="recommendation-details">
                  <span className="timeframe">⏱️ {rec.timeframe}</span>
                  <span className="action">👉 {rec.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'eligibility' && (
        <div className="eligibility-content">
          <h3>🏦 Loan Eligibility Check</h3>
          
          <div className="eligibility-card">
            <div className="decision-badge">
              <span className={decisionBadge.class}>{decisionBadge.text}</span>
            </div>

            {loanEligibility.eligible ? (
              <>
                <div className="loan-details">
                  <div className="detail-item">
                    <span className="detail-label">Maximum Loan Amount:</span>
                    <span className="detail-value">R {loanEligibility.maxLoan.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estimated Interest Rate:</span>
                    <span className="detail-value">{loanEligibility.interestRate}% APR</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Monthly Payment (5 years):</span>
                    <span className="detail-value">
                      R {Math.round(loanEligibility.maxLoan / 60).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Prolog-style reasoning */}
                <div className="reasoning-box">
                  <h4>📋 Decision Reasoning:</h4>
                  <ul>
                    {simulationResult?.projectedScore >= 700 && (
                      <li>✓ Excellent credit score ({simulationResult.projectedScore})</li>
                    )}
                    {simulationResult?.projectedScore >= 650 && simulationResult?.projectedScore < 700 && (
                      <li>✓ Good credit score ({simulationResult.projectedScore})</li>
                    )}
                    {loanEligibility.decision === 'approved' && (
                      <>
                        <li>✓ Debt-to-income ratio within limits</li>
                        <li>✓ Strong payment history</li>
                      </>
                    )}
                    {loanEligibility.decision === 'conditional' && (
                      <li>⚠️ Additional documentation required</li>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div className="rejection-message">
                <p>Based on your current credit profile:</p>
                <ul>
                  {simulationResult?.projectedScore < 600 && (
                    <li>❌ Credit score too low ({simulationResult.projectedScore})</li>
                  )}
                  {((simulationData.debtAmount / simulationData.income) * 100) > 50 && (
                    <li>❌ Debt-to-income ratio too high</li>
                  )}
                  {simulationData.paymentHistory < 70 && (
                    <li>❌ Poor payment history</li>
                  )}
                </ul>
                <p className="suggestion">Try improving your credit factors in the simulator tab</p>
              </div>
            )}
          </div>

          {/* Quick Comparison */}
          <div className="comparison-section">
            <h4>📊 Score Comparison</h4>
            <div className="comparison-grid">
              <div className="comparison-item">
                <span>Your Score:</span>
                <strong style={{ color: scoreCategory?.color }}>
                  {simulationResult?.projectedScore} ({scoreCategory?.category})
                </strong>
              </div>
              <div className="comparison-item">
                <span>Good Credit:</span>
                <strong style={{ color: '#27ae60' }}>700+ (Good)</strong>
              </div>
              <div className="comparison-item">
                <span>Excellent Credit:</span>
                <strong style={{ color: '#2ecc71' }}>750+ (Excellent)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="simulator-footer">
        <button 
          className="apply-button"
          onClick={() => onSimulationComplete && onSimulationComplete({
            score: simulationResult?.projectedScore,
            eligibility: loanEligibility,
            data: simulationData
          })}
        >
          Apply These Settings to Loan Application
        </button>
        <small className="disclaimer">
          *This is a simulation for educational purposes. Actual credit scores may vary based on multiple factors.
        </small>
      </div>
    </div>
  );
};

export default CreditScoreSimulator;