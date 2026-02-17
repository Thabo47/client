import React from 'react';
import './LoanResult.css';

const LoanResult = ({ result, applicationData, onNewApplication }) => {
  const { decision, reason } = result;

  const getDecisionIcon = () => {
    switch (decision) {
      case 'approved':
        return '✅';
      case 'conditional':
        return '⚠️';
      case 'rejected':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getDecisionColor = () => {
    switch (decision) {
      case 'approved':
        return '#52c41a';
      case 'conditional':
        return '#faad14';
      case 'rejected':
        return '#f5222d';
      default:
        return '#666';
    }
  };

  const getDecisionMessage = () => {
    switch (decision) {
      case 'approved':
        return 'Congratulations! Your loan has been approved.';
      case 'conditional':
        return 'Your loan has been conditionally approved.';
      case 'rejected':
        return 'We regret to inform you that your loan has been rejected.';
      default:
        return 'Unable to process application.';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePDFContent = () => {
    const employmentLabels = {
      employed: 'Employed (Full Time)',
      self_employed: 'Self Employed',
      part_time: 'Part Time',
      contract: 'Contract'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Loan Application Decision - Motsitseng Financial Services</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #667eea; }
          .logo { font-size: 24px; font-weight: bold; color: #667eea; margin-bottom: 5px; }
          .subtitle { color: #666; font-size: 14px; }
          .decision-badge { 
            display: inline-block; 
            padding: 10px 30px; 
            border-radius: 50px; 
            font-size: 20px; 
            font-weight: bold;
            margin: 20px 0;
            background: ${decision === 'approved' ? '#52c41a20' : decision === 'conditional' ? '#faad1420' : '#f5222d20'};
            color: ${getDecisionColor()};
          }
          .section { margin: 30px 0; }
          .section-title { 
            color: #667eea; 
            border-bottom: 2px solid #667eea; 
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .info-item { margin-bottom: 15px; }
          .info-label { font-weight: bold; color: #666; font-size: 14px; margin-bottom: 5px; }
          .info-value { font-size: 16px; color: #333; }
          .reason-box { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0;
            border-left: 5px solid ${getDecisionColor()};
          }
          .terms { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 2px dashed #ddd;
            font-size: 12px;
            color: #999;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 12px; 
            color: #999;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          td { padding: 10px; border-bottom: 1px solid #f0f0f0; }
          td:first-child { font-weight: bold; width: 40%; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Motsitseng Financial Services</div>
          <div class="subtitle">Your Trusted Financial Partner</div>
          <div class="decision-badge">${decision.toUpperCase()}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Loan Decision Summary</h2>
          <div class="reason-box">
            <strong>Decision Reason:</strong> ${reason}
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Application Details</h2>
          <table>
            <tr><td>Application Reference</td><td>MFS-${Date.now().toString().slice(-8)}</td></tr>
            <tr><td>Application Date</td><td>${formatDate()}</td></tr>
            <tr><td>Decision Date</td><td>${formatDate()}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Personal Information</h2>
          <table>
            <tr><td>Age</td><td>${applicationData.age} years</td></tr>
            <tr><td>Employment Status</td><td>${employmentLabels[applicationData.employment] || applicationData.employment}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Financial Information</h2>
          <table>
            <tr><td>Monthly Income</td><td>${formatCurrency(applicationData.income)}</td></tr>
            <tr><td>Monthly Expenses</td><td>${formatCurrency(applicationData.expenses)}</td></tr>
            <tr><td>Credit Score</td><td>${applicationData.creditScore}</td></tr>
            <tr><td>Existing Debt</td><td>${formatCurrency(applicationData.existingDebt)}</td></tr>
            <tr><td>Requested Loan Amount</td><td>${formatCurrency(applicationData.loanAmount)}</td></tr>
            <tr><td>Loan Period</td><td>${applicationData.loanPeriod} years</td></tr>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Key Ratios</h2>
          <table>
            <tr><td>Monthly Payment (Estimated)</td><td>${formatCurrency(applicationData.loanAmount / (applicationData.loanPeriod * 12))}</td></tr>
            <tr><td>Total Monthly Obligations</td><td>${formatCurrency(applicationData.expenses + (applicationData.existingDebt / 12))}</td></tr>
            <tr><td>Debt-to-Income Ratio</td><td>${(((applicationData.expenses + (applicationData.existingDebt / 12)) / applicationData.income) * 100).toFixed(1)}%</td></tr>
          </table>
        </div>

        ${decision === 'approved' ? `
        <div class="section">
          <h2 class="section-title">Next Steps</h2>
          <ol style="color: #333; line-height: 1.8;">
            <li>Review the loan agreement carefully</li>
            <li>Sign and return the agreement within 14 days</li>
            <li>Provide bank account details for disbursement</li>
            <li>Funds will be transferred within 2-3 business days</li>
          </ol>
        </div>
        ` : decision === 'conditional' ? `
        <div class="section">
          <h2 class="section-title">Required Actions</h2>
          <ol style="color: #333; line-height: 1.8;">
            <li>Provide additional income documentation (latest 3 months bank statements)</li>
            <li>Submit proof of collateral or guarantor details</li>
            <li>Complete a detailed expenditure review form</li>
            <li>Schedule a follow-up interview with our loan officer</li>
          </ol>
        </div>
        ` : `
        <div class="section">
          <h2 class="section-title">Suggestions for Future Applications</h2>
          <ul style="color: #333; line-height: 1.8;">
            <li>Work on improving your credit score</li>
            <li>Reduce existing debt before reapplying</li>
            <li>Consider a smaller loan amount</li>
            <li>Build a stronger employment history</li>
            <li>Save for a larger down payment</li>
          </ul>
        </div>
        `}

        <div class="terms">
          <p><strong>Terms and Conditions:</strong> This decision is based on the information provided in your application. Motsitseng Financial Services reserves the right to verify all information provided. Any discrepancies may result in reversal of this decision. This offer is valid for 30 days from the date of this letter.</p>
        </div>

        <div class="footer">
          <p>Motsitseng Financial Services (Pty) Ltd | Reg No: 2010/123456/07 | FSP No: 45678</p>
          <p>123 Maude Street, Sandton, Johannesburg, 2196 | Tel: 0800 123 456 | Email: info@motsitseng.co.za</p>
          <p>This is a computer-generated document. No signature is required.</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownload = () => {
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MFS_Loan_Decision_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="result-container">
      <div className="result-card" style={{ borderColor: getDecisionColor() }}>
        <div className="result-header">
          <span className="result-icon">{getDecisionIcon()}</span>
          <h2 style={{ color: getDecisionColor() }}>
            Loan {decision.charAt(0).toUpperCase() + decision.slice(1)}
          </h2>
        </div>

        <div className="result-content">
          <p className="result-message">{getDecisionMessage()}</p>
          
          <div className="result-details">
            <h3>Decision Details:</h3>
            <p className="result-reason">{reason}</p>
          </div>

          <div className="application-summary">
            <h3>Application Summary:</h3>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Age:</td>
                  <td>{applicationData.age} years</td>
                </tr>
                <tr>
                  <td>Employment:</td>
                  <td>{applicationData.employment.replace('_', ' ').charAt(0).toUpperCase() + applicationData.employment.replace('_', ' ').slice(1)}</td>
                </tr>
                <tr>
                  <td>Monthly Income:</td>
                  <td>{formatCurrency(applicationData.income)}</td>
                </tr>
                <tr>
                  <td>Credit Score:</td>
                  <td>{applicationData.creditScore}</td>
                </tr>
                <tr>
                  <td>Loan Request:</td>
                  <td>{formatCurrency(applicationData.loanAmount)} over {applicationData.loanPeriod} years</td>
                </tr>
              </tbody>
            </table>
          </div>

          {decision === 'conditional' && (
            <div className="conditional-requirements">
              <h3>Additional Requirements:</h3>
              <ul>
                <li>Provide additional income documentation (latest 3 months bank statements)</li>
                <li>Submit proof of collateral or guarantor details</li>
                <li>Complete a detailed expenditure review form</li>
                <li>Schedule a follow-up interview with our loan officer</li>
              </ul>
            </div>
          )}

          {decision === 'approved' && (
            <div className="next-steps">
              <h3>Next Steps:</h3>
              <ol>
                <li>Review and sign the loan agreement (sent to your email)</li>
                <li>Provide bank account details for disbursement</li>
                <li>Funds will be transferred within 2-3 business days</li>
                <li>First repayment will be due 30 days after disbursement</li>
              </ol>
            </div>
          )}

          {decision === 'rejected' && (
            <div className="rejection-info">
              <h3>Suggestions for Future Applications:</h3>
              <ul>
                <li>Work on improving your credit score (pay bills on time, reduce credit utilization)</li>
                <li>Reduce existing debt before reapplying</li>
                <li>Consider a smaller loan amount or longer repayment period</li>
                <li>Build a stronger employment history (minimum 6 months in current job)</li>
                <li>Save for a larger down payment (at least 20% of loan amount)</li>
              </ul>
              <p className="rejection-note">
                <strong>Note:</strong> You may reapply after 3 months. Our loan officers are available 
                to discuss ways to strengthen your application.
              </p>
            </div>
          )}
        </div>

        <div className="result-actions">
          <button onClick={onNewApplication} className="new-application-btn">
            New Application
          </button>
          <button onClick={handleDownload} className="download-btn">
            Download Decision Letter
          </button>
        </div>

        <div className="result-footer">
          <p>Reference: MFS-{Date.now().toString().slice(-8)}</p>
          <p>Date: {formatDate()}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanResult;