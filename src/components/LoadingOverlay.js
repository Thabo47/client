import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ message = "Processing your application..." }) => {
  const tips = [
    "A good credit score can save you thousands in interest!",
    "Paying bills on time improves your credit score by 35%",
    "Keep credit utilization below 30% for best results",
    "You can apply for pre-approval with no impact to your credit score",
    "Fixed interest rates offer predictable monthly payments",
    "Early repayment can save you money on interest",
    "We offer personalized rates based on your credit profile"
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
      <div className="loading-tips">
        <span className="tip-icon">💡</span>
        <div className="tip-content">
          <span className="tip-label">Did you know?</span>
          <p>{randomTip}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;