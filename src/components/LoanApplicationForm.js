import React, { useState, useEffect } from 'react';

function LoanApplicationForm({ onSubmit, prefilledAmount = null, selectedProduct = null }) {
  const [formData, setFormData] = useState({
    age: '',
    employment: 'full_time',
    income: '',
    expenses: '',
    creditScore: '',
    existingDebts: '',
    loanAmount: '',
    repaymentPeriod: ''
  });
  
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Prefill form when props change
  useEffect(() => {
    if (prefilledAmount) {
      setFormData(prev => ({
        ...prev,
        loanAmount: prefilledAmount
      }));
    }
    
    if (selectedProduct) {
      // You can prefill more fields based on the selected product
      console.log('Selected product:', selectedProduct);
      // Example: if selectedProduct has recommended term
      if (selectedProduct.recommendedTerm) {
        setFormData(prev => ({
          ...prev,
          repaymentPeriod: selectedProduct.recommendedTerm
        }));
      }
    }
  }, [prefilledAmount, selectedProduct]);

  // Calculate progress whenever form data changes
  useEffect(() => {
    const filledFields = Object.values(formData).filter(val => val !== '').length;
    const totalFields = Object.keys(formData).length;
    setFormProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  const validateField = (name, value) => {
    const numValue = parseFloat(value);
    
    switch(name) {
      case 'age':
        if (value && (numValue < 18 || numValue > 70)) {
          return 'Age must be between 18 and 70';
        }
        break;
      case 'income':
        if (value && numValue <= 0) {
          return 'Income must be greater than 0';
        }
        break;
      case 'expenses':
        if (value && numValue < 0) {
          return 'Expenses cannot be negative';
        }
        if (value && formData.income && numValue > parseFloat(formData.income)) {
          return 'Expenses cannot exceed income';
        }
        break;
      case 'creditScore':
        if (value && (numValue < 300 || numValue > 850)) {
          return 'Credit score must be between 300 and 850';
        }
        break;
      case 'loanAmount':
        if (value && numValue < 1000) {
          return 'Minimum loan amount is M 1,000';
        }
        break;
      case 'repaymentPeriod':
        if (value && (numValue < 1 || numValue > 360)) {
          return 'Repayment period must be between 1 and 360 months';
        }
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field
    const error = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    setError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(val => val !== '');
    if (!allFieldsFilled) {
      setError('Please fill in all required fields');
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Convert string values to numbers
    const numericData = {
      age: parseInt(formData.age),
      employment: formData.employment,
      income: parseFloat(formData.income),
      expenses: parseFloat(formData.expenses),
      creditScore: parseInt(formData.creditScore),
      existingDebts: parseFloat(formData.existingDebts),
      loanAmount: parseFloat(formData.loanAmount),
      repaymentPeriod: parseInt(formData.repaymentPeriod)
    };
    
    try {
      await onSubmit(numericData);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial ratios in real-time
  const calculateDTI = () => {
    if (formData.income && formData.expenses && formData.existingDebts) {
      const income = parseFloat(formData.income);
      const expenses = parseFloat(formData.expenses);
      const debts = parseFloat(formData.existingDebts);
      
      if (income > 0) {
        const monthlyDebtPayment = debts * 0.03;
        const totalObligations = expenses + monthlyDebtPayment;
        const dti = (totalObligations / income) * 100;
        return dti.toFixed(1);
      }
    }
    return null;
  };

  const calculateLTI = () => {
    if (formData.income && formData.loanAmount) {
      const income = parseFloat(formData.income);
      const loan = parseFloat(formData.loanAmount);
      
      if (income > 0) {
        const annualIncome = income * 12;
        const lti = (loan / annualIncome) * 100;
        return lti.toFixed(1);
      }
    }
    return null;
  };

  const calculateDisposableIncome = () => {
    if (formData.income && formData.expenses) {
      const income = parseFloat(formData.income);
      const expenses = parseFloat(formData.expenses);
      return (income - expenses).toFixed(0);
    }
    return null;
  };

  const dti = calculateDTI();
  const lti = calculateLTI();
  const disposableIncome = calculateDisposableIncome();

  const getDTIStatus = () => {
    if (!dti) return null;
    const value = parseFloat(dti);
    if (value <= 40) return { text: 'Good', color: '#28a745' };
    if (value <= 50) return { text: 'Fair', color: '#ffc107' };
    return { text: 'High', color: '#dc3545' };
  };

  const getLTIStatus = () => {
    if (!lti) return null;
    const value = parseFloat(lti);
    if (value <= 300) return { text: 'Good', color: '#28a745' };
    if (value <= 400) return { text: 'Fair', color: '#ffc107' };
    return { text: 'High', color: '#dc3545' };
  };

  const dtiStatus = getDTIStatus();
  const ltiStatus = getLTIStatus();

  return (
    <div className="card">
      <h1 className="form-title">
        Loan Application Form
        {selectedProduct && (
          <span style={{ 
            display: 'block', 
            fontSize: '1rem', 
            color: '#FF6B35',
            marginTop: '0.5rem'
          }}>
            Recommended: {selectedProduct.name}
          </span>
        )}
      </h1>
      
      {/* Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          height: '8px', 
          background: '#e0e0e0', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${formProgress}%`, 
            height: '100%',
            background: 'linear-gradient(90deg, #FF6B35, #C41E3A)',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Form completion: {formProgress}%
        </p>
      </div>
      
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
      
      {/* Financial Overview Dashboard */}
      {(dti || lti || disposableIncome) && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
          padding: '1.5rem', 
          borderRadius: '10px',
          marginBottom: '2rem',
          border: '2px solid #FFB347',
          boxShadow: '0 4px 10px rgba(255, 179, 71, 0.2)'
        }}>
          <h4 style={{ 
            color: '#C41E3A', 
            marginBottom: '1rem',
            fontSize: '1.1rem',
            borderBottom: '2px solid #FFB347',
            paddingBottom: '0.5rem'
          }}>
            Financial Health Overview
          </h4>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {dti && dtiStatus && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#666' }}>Debt-to-Income Ratio</span>
                  <span style={{ fontWeight: 'bold', color: dtiStatus.color }}>{dtiStatus.text}</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#e0e0e0', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '0.3rem'
                }}>
                  <div style={{ 
                    width: `${Math.min(parseFloat(dti), 100)}%`, 
                    height: '100%',
                    background: dtiStatus.color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#C41E3A' }}>
                  {dti}%
                </p>
              </div>
            )}
            
            {lti && ltiStatus && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#666' }}>Loan-to-Income Ratio</span>
                  <span style={{ fontWeight: 'bold', color: ltiStatus.color }}>{ltiStatus.text}</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#e0e0e0', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '0.3rem'
                }}>
                  <div style={{ 
                    width: `${Math.min((parseFloat(lti) / 5), 100)}%`, 
                    height: '100%',
                    background: ltiStatus.color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#C41E3A' }}>
                  {lti}%
                </p>
              </div>
            )}
            
            {disposableIncome && (
              <div>
                <span style={{ color: '#666' }}>Monthly Disposable Income</span>
                <p style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  color: parseFloat(disposableIncome) > 0 ? '#28a745' : '#dc3545'
                }}>
                  M {parseInt(disposableIncome).toLocaleString()}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>
                  After expenses
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>
              Age <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              min="18"
              max="70"
              placeholder="Enter your age"
              style={{
                borderColor: touched.age && validationErrors.age ? '#dc3545' : '#FF8C5A'
              }}
            />
            {touched.age && validationErrors.age && (
              <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {validationErrors.age}
              </p>
            )}
            <span className="input-hint">Minimum 18 years, Maximum 70 years</span>
          </div>

          <div className="form-group">
            <label>
              Employment Status <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <select
              name="employment"
              value={formData.employment}
              onChange={handleChange}
              required
              style={{
                borderColor: '#FF8C5A'
              }}
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="self_employed">Self Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Monthly Income (M) <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              min="0"
              step="100"
              placeholder="Enter monthly income"
              style={{
                borderColor: touched.income && validationErrors.income ? '#dc3545' : '#FF8C5A'
              }}
            />
            {touched.income && validationErrors.income && (
              <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {validationErrors.income}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>
              Monthly Expenses (M) <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              min="0"
              step="100"
              placeholder="Enter monthly expenses"
              style={{
                borderColor: touched.expenses && validationErrors.expenses ? '#dc3545' : '#FF8C5A'
              }}
            />
            {touched.expenses && validationErrors.expenses && (
              <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {validationErrors.expenses}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>
              Credit Score <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <input
              type="number"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              min="300"
              max="850"
              placeholder="Enter credit score"
              style={{
                borderColor: touched.creditScore && validationErrors.creditScore ? '#dc3545' : '#FF8C5A'
              }}
            />
            {touched.creditScore && validationErrors.creditScore && (
              <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {validationErrors.creditScore}
              </p>
            )}
            <span className="input-hint">Range: 300 (Poor) - 850 (Excellent)</span>
          </div>

          <div className="form-group">
            <label>
              Existing Debts (M) <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <input
              type="number"
              name="existingDebts"
              value={formData.existingDebts}
              onChange={handleChange}
              required
              min="0"
              step="100"
              placeholder="Enter total existing debts"
              style={{
                borderColor: '#FF8C5A'
              }}
            />
          </div>

          <div className="form-group">
            <label>
              Loan Amount (M) <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              min="1000"
              step="1000"
              placeholder="Enter loan amount"
              style={{
                borderColor: touched.loanAmount && validationErrors.loanAmount ? '#dc3545' : '#FF8C5A',
                background: prefilledAmount ? '#fff3cd' : 'white'
              }}
            />
            {touched.loanAmount && validationErrors.loanAmount && (
              <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {validationErrors.loanAmount}
              </p>
            )}
            {prefilledAmount && (
              <p style={{ color: '#856404', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                Amount prefilled from calculator
              </p>
            )}
            <span className="input-hint">Minimum: M 1,000</span>
          </div>

          <div className="form-group">
            <label>
              Repayment Period (months) <span style={{ color: '#C41E3A' }}>*</span>
            </label>
            <input
              type="number"
              name="repaymentPeriod"
              value={formData.repaymentPeriod}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              min="1"
              max="360"
              placeholder="Enter repayment period"
              style={{
                borderColor: touched.repaymentPeriod && validationErrors.repaymentPeriod ? '#dc3545' : '#FF8C5A'
              }}
            />
            {touched.repaymentPeriod && validationErrors.repaymentPeriod && (
              <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {validationErrors.repaymentPeriod}
              </p>
            )}
            <span className="input-hint">Maximum: 360 months (30 years)</span>
          </div>
        </div>

        {/* Loan Summary */}
        {formProgress === 100 && !error && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid #c3e6cb'
          }}>
            ✓ All fields completed. Ready to submit!
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || formProgress < 100 || Object.values(validationErrors).some(error => error)}
          style={{
            opacity: (loading || formProgress < 100 || Object.values(validationErrors).some(error => error)) ? 0.6 : 1,
            cursor: (loading || formProgress < 100 || Object.values(validationErrors).some(error => error)) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  );
}

export default LoanApplicationForm;