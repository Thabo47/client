import React from 'react';

function LoanResult({ result, applicationData, onNewApplication, error }) {
  const getResultDetails = () => {
    if (error) {
      return {
        title: 'Error',
        message: error,
        details: 'Please try again or contact support.',
        color: 'var(--deep-red)'
      };
    }
    
    switch(result) {
      case 'approved':
        return {
          title: 'Application Approved!',
          message: 'Congratulations! Your loan application has been approved.',
          details: 'Based on your financial profile, you meet all our lending criteria.',
          nextSteps: [
            'Check your email for the loan agreement',
            'Review and sign the documents',
            'Funds will be disbursed within 2-3 business days'
          ],
          color: 'var(--success-green)'
        };
      case 'conditional':
        return {
          title: 'Conditionally Approved',
          message: 'Your application requires additional review.',
          details: 'Please contact our loan officer to discuss further requirements.',
          nextSteps: [
            'Contact our loan officer at loans@mfs.co.za',
            'Provide additional documentation if requested',
            'Schedule a follow-up interview'
          ],
          color: 'var(--gold)'
        };
      case 'rejected':
        return {
          title: 'Application Rejected',
          message: 'We regret to inform you that your application cannot be approved at this time.',
          details: 'This decision is based on our lending criteria. You may reapply after 3 months.',
          nextSteps: [
            'Review your credit report',
            'Work on improving your debt-to-income ratio',
            'Consider a smaller loan amount',
            'Reapply in 3 months'
          ],
          color: 'var(--deep-red)'
        };
      default:
        return {
          title: 'Unknown Result',
          message: 'An unexpected result was returned.',
          details: 'Please try again or contact support.',
          nextSteps: ['Contact support for assistance'],
          color: 'var(--gray)'
        };
    }
  };

  const details = getResultDetails();

  // Calculate some metrics for display
  const calculateMetrics = () => {
    if (!applicationData) return null;
    
    const monthlyDebtPayment = applicationData.existingDebts * 0.03;
    const totalObligations = applicationData.expenses + monthlyDebtPayment;
    const dti = (totalObligations / applicationData.income) * 100;
    
    const annualIncome = applicationData.income * 12;
    const lti = (applicationData.loanAmount / annualIncome) * 100;
    
    return { dti: dti.toFixed(1), lti: lti.toFixed(1) };
  };

  const metrics = calculateMetrics();

  return (
    <div className="card result-card">
      <h1 className={`result-title ${result || 'error'}`}>
        {details.title}
      </h1>
      
      <p className="result-message">
        {details.message}
      </p>
      
      {applicationData && !error && (
        <>
          <div className="result-details">
            <h3>Application Summary</h3>
            <p><strong>Age:</strong> {applicationData.age} years</p>
            <p><strong>Employment:</strong> {applicationData.employment.replace(/_/g, ' ')}</p>
            <p><strong>Monthly Income:</strong> M {applicationData.income.toLocaleString()}</p>
            <p><strong>Monthly Expenses:</strong> M {applicationData.expenses.toLocaleString()}</p>
            <p><strong>Credit Score:</strong> {applicationData.creditScore}</p>
            <p><strong>Existing Debts:</strong> M {applicationData.existingDebts.toLocaleString()}</p>
            <p><strong>Loan Amount:</strong> M {applicationData.loanAmount.toLocaleString()}</p>
            <p><strong>Repayment Period:</strong> {applicationData.repaymentPeriod} months</p>
            
            {metrics && (
              <>
                <hr style={{ margin: '1rem 0', borderColor: 'var(--gold)' }} />
                <h4>Financial Ratios</h4>
                <p><strong>Debt-to-Income Ratio:</strong> {metrics.dti}%</p>
                <p><strong>Loan-to-Income Ratio:</strong> {metrics.lti}%</p>
              </>
            )}
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h3 style={{ color: details.color, marginBottom: '1rem' }}>
              Next Steps:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {details.nextSteps.map((step, index) => (
                <li key={index} style={{
                  padding: '0.8rem',
                  margin: '0.5rem 0',
                  background: 'var(--off-white)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${details.color}`
                }}>
                  {index + 1}. {step}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      {error && (
        <div className="error-message" style={{ marginBottom: '2rem' }}>
          {error}
        </div>
      )}
      
      <p style={{ color: 'var(--gray)', marginBottom: '2rem', fontStyle: 'italic' }}>
        {details.details}
      </p>
      
      <button 
        className="new-application-btn"
        onClick={onNewApplication}
      >
        New Application
      </button>
    </div>
  );
}

export default LoanResult;