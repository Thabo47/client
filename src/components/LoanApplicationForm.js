import React, { useState, useEffect } from 'react';
import './LoanApplicationForm.css';

const LoanApplicationForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    age: '',
    employment: 'employed',
    income: '',
    expenses: '',
    creditScore: '',
    existingDebt: '',
    loanAmount: '',
    loanPeriod: ''
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formProgress, setFormProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const [validationSummary, setValidationSummary] = useState({});

  const employmentTypes = [
    { value: 'employed', label: 'Employed (Full Time)' },
    { value: 'self_employed', label: 'Self Employed' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' }
  ];

  // Define form sections for step tracking
  const formSteps = [
    {
      id: 1,
      title: 'Personal Details',
      fields: ['age', 'employment'],
      icon: '👤',
      description: 'Basic information about you'
    },
    {
      id: 2,
      title: 'Financial Overview',
      fields: ['income', 'expenses'],
      icon: '💰',
      description: 'Your monthly income and expenses'
    },
    {
      id: 3,
      title: 'Credit History',
      fields: ['creditScore', 'existingDebt'],
      icon: '📊',
      description: 'Your credit profile'
    },
    {
      id: 4,
      title: 'Loan Details',
      fields: ['loanAmount', 'loanPeriod'],
      icon: '🏦',
      description: 'What you\'re applying for'
    }
  ];

  // Real-time validation
  useEffect(() => {
    const newValidationSummary = {};
    
    // Age validation
    if (formData.age) {
      const age = parseInt(formData.age);
      if (age < 18) newValidationSummary.age = '❌ Must be at least 18 years old';
      else if (age > 65) newValidationSummary.age = '❌ Maximum age is 65';
      else newValidationSummary.age = '✅ Age valid';
    }

    // Income vs Expenses validation
    if (formData.income && formData.expenses) {
      const income = parseFloat(formData.income);
      const expenses = parseFloat(formData.expenses);
      const disposable = income - expenses;
      
      if (expenses > income) {
        newValidationSummary.affordability = '❌ Expenses exceed income';
      } else if (disposable < income * 0.2) {
        newValidationSummary.affordability = '⚠️ Low disposable income';
      } else {
        newValidationSummary.affordability = '✅ Healthy income-to-expense ratio';
      }
    }

    // Credit score indicator
    if (formData.creditScore) {
      const score = parseInt(formData.creditScore);
      if (score >= 700) newValidationSummary.credit = '✅ Excellent credit';
      else if (score >= 600) newValidationSummary.credit = '⚠️ Average credit';
      else if (score >= 300) newValidationSummary.credit = '❌ Poor credit';
    }

    // Loan affordability preview
    if (formData.loanAmount && formData.loanPeriod && formData.income) {
      const monthlyPayment = parseFloat(formData.loanAmount) / (parseFloat(formData.loanPeriod) * 12);
      const income = parseFloat(formData.income);
      const paymentRatio = (monthlyPayment / income) * 100;
      
      if (paymentRatio > 40) {
        newValidationSummary.loanAffordability = '⚠️ Monthly payment may be too high';
      } else {
        newValidationSummary.loanAffordability = '✅ Loan payment seems affordable';
      }
    }

    setValidationSummary(newValidationSummary);
  }, [formData]);

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = ['age', 'income', 'expenses', 'creditScore', 'existingDebt', 'loanAmount', 'loanPeriod'];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].toString().trim() !== '');
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    setFormProgress(progress);
  }, [formData]);

  // Calculate field completion status
  const getFieldStatus = (fieldName) => {
    const value = formData[fieldName];
    const isFilled = value && value.toString().trim() !== '';
    const hasError = errors[fieldName];
    const isTouched = touchedFields[fieldName];

    if (hasError && isTouched) return 'error';
    if (isFilled && !hasError) return 'completed';
    if (isTouched && !isFilled) return 'pending';
    return 'incomplete';
  };

  // Get completion percentage for a section
  const getSectionProgress = (section) => {
    const fieldsInSection = section.fields;
    const completedFields = fieldsInSection.filter(field => 
      formData[field] && formData[field].toString().trim() !== '' && !errors[field]
    ).length;
    return Math.round((completedFields / fieldsInSection.length) * 100);
  };

  const validateForm = () => {
    const newErrors = {};

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 65) {
        newErrors.age = 'Age must be between 18 and 65';
      }
    }

    // Income validation
    if (!formData.income) {
      newErrors.income = 'Monthly income is required';
    } else {
      const income = parseFloat(formData.income);
      if (isNaN(income) || income <= 0) {
        newErrors.income = 'Monthly income must be greater than 0';
      }
    }

    // Expenses validation
    if (!formData.expenses) {
      newErrors.expenses = 'Monthly expenses are required';
    } else {
      const expenses = parseFloat(formData.expenses);
      if (isNaN(expenses) || expenses < 0) {
        newErrors.expenses = 'Monthly expenses must be a valid number';
      }
    }

    // Credit score validation
    if (!formData.creditScore) {
      newErrors.creditScore = 'Credit score is required';
    } else {
      const creditScore = parseInt(formData.creditScore);
      if (isNaN(creditScore) || creditScore < 300 || creditScore > 850) {
        newErrors.creditScore = 'Credit score must be between 300 and 850';
      }
    }

    // Existing debt validation
    if (!formData.existingDebt) {
      newErrors.existingDebt = 'Existing debt is required';
    } else {
      const existingDebt = parseFloat(formData.existingDebt);
      if (isNaN(existingDebt) || existingDebt < 0) {
        newErrors.existingDebt = 'Existing debt must be a valid number';
      }
    }

    // Loan amount validation
    if (!formData.loanAmount) {
      newErrors.loanAmount = 'Loan amount is required';
    } else {
      const loanAmount = parseFloat(formData.loanAmount);
      if (isNaN(loanAmount) || loanAmount <= 0) {
        newErrors.loanAmount = 'Loan amount must be greater than 0';
      }
    }

    // Loan period validation
    if (!formData.loanPeriod) {
      newErrors.loanPeriod = 'Loan period is required';
    } else {
      const loanPeriod = parseInt(formData.loanPeriod);
      if (isNaN(loanPeriod) || loanPeriod < 1 || loanPeriod > 30) {
        newErrors.loanPeriod = 'Loan period must be between 1 and 30 years';
      }
    }

    // Check if expenses exceed income
    if (formData.income && formData.expenses) {
      const income = parseFloat(formData.income);
      const expenses = parseFloat(formData.expenses);
      if (expenses > income) {
        newErrors.expenses = 'Monthly expenses cannot exceed monthly income';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allFields = ['age', 'employment', 'income', 'expenses', 'creditScore', 'existingDebt', 'loanAmount', 'loanPeriod'];
    const touched = {};
    allFields.forEach(field => touched[field] = true);
    setTouchedFields(touched);

    if (validateForm()) {
      // Convert string values to appropriate types before submitting
      const processedData = {
        age: parseInt(formData.age),
        employment: formData.employment,
        income: parseFloat(formData.income),
        expenses: parseFloat(formData.expenses),
        creditScore: parseInt(formData.creditScore),
        existingDebt: parseFloat(formData.existingDebt),
        loanAmount: parseFloat(formData.loanAmount),
        loanPeriod: parseInt(formData.loanPeriod)
      };
      
      onSubmit(processedData);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const isStepAccessible = (step) => {
    if (step === 1) return true;
    if (step === 2) return formData.age;
    if (step === 3) return formData.income && formData.expenses;
    if (step === 4) return formData.creditScore && formData.existingDebt;
    return false;
  };

  const resetForm = () => {
    setFormData({
      age: '',
      employment: 'employed',
      income: '',
      expenses: '',
      creditScore: '',
      existingDebt: '',
      loanAmount: '',
      loanPeriod: ''
    });
    setErrors({});
    setTouchedFields({});
    setCurrentStep(1);
    setValidationSummary({});
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>🏦 Loan Application Form</h2>
        <p>Please fill in all the required information accurately for evaluation</p>
      </div>

      {/* Progress Tracking Section */}
      <div className="progress-section">
        <div className="progress-header">
          <div className="progress-title">
            <span className="progress-icon">📋</span>
            <span>Application Progress</span>
          </div>
          <button 
            className="progress-toggle"
            onClick={() => setShowProgressDetails(!showProgressDetails)}
            type="button"
          >
            {showProgressDetails ? 'Hide Details ▲' : 'Show Details ▼'}
          </button>
        </div>

        {/* Main Progress Bar */}
        <div className="progress-main">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${formProgress}%` }}
            />
            <span className="progress-percentage">{formProgress}% Complete</span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="step-indicators">
          {formSteps.map((step, index) => (
            <div key={step.id} className="step-wrapper">
              <button
                type="button"
                className={`step-button ${currentStep === step.id ? 'active' : ''} ${
                  isStepAccessible(step.id) ? 'accessible' : 'locked'
                }`}
                onClick={() => isStepAccessible(step.id) && goToStep(step.id)}
                disabled={!isStepAccessible(step.id)}
              >
                <span className="step-icon">{step.icon}</span>
                <span className="step-number">Step {step.id}</span>
                <span className="step-title">{step.title}</span>
                <span className="step-progress">{getSectionProgress(step)}%</span>
              </button>
              {index < formSteps.length - 1 && (
                <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Detailed Progress Panel */}
        {showProgressDetails && (
          <div className="progress-details">
            <h4>Completion Details</h4>
            <div className="details-grid">
              {formSteps.map(step => (
                <div key={step.id} className="detail-item">
                  <div className="detail-header">
                    <span className="detail-icon">{step.icon}</span>
                    <span className="detail-title">{step.title}</span>
                    <span className="detail-percentage">{getSectionProgress(step)}%</span>
                  </div>
                  <div className="detail-bar">
                    <div 
                      className="detail-bar-fill" 
                      style={{ width: `${getSectionProgress(step)}%` }}
                    />
                  </div>
                  <div className="detail-fields">
                    {step.fields.map(field => (
                      <div key={field} className={`field-status status-${getFieldStatus(field)}`}>
                        <span className="field-name">
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="field-indicator">
                          {getFieldStatus(field) === 'completed' && '✓'}
                          {getFieldStatus(field) === 'error' && '⚠️'}
                          {getFieldStatus(field) === 'pending' && '○'}
                          {getFieldStatus(field) === 'incomplete' && '○'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-badge">
                <span className="stat-value">{formProgress}%</span>
                <span className="stat-label">Overall</span>
              </div>
              <div className="stat-badge">
                <span className="stat-value">
                  {Object.values(formData).filter(v => v && v.toString().trim() !== '').length}
                </span>
                <span className="stat-label">Fields Filled</span>
              </div>
              <div className="stat-badge">
                <span className="stat-value">
                  {Object.keys(errors).length}
                </span>
                <span className="stat-label">Errors</span>
              </div>
              <div className="stat-badge">
                <span className="stat-value">{currentStep}</span>
                <span className="stat-label">Current Step</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Summary */}
      {Object.keys(validationSummary).length > 0 && (
        <div className="validation-summary">
          <h4>Real-time Assessment:</h4>
          {Object.entries(validationSummary).map(([key, value]) => (
            <div key={key} className="validation-item">
              {value}
            </div>
          ))}
        </div>
      )}

      {/* Current Step Indicator */}
      <div className="current-step-badge">
        Step {currentStep} of 4: {formSteps[currentStep - 1].title}
      </div>

      <form onSubmit={handleSubmit} className="loan-form">
        {/* Step 1: Personal Details */}
        <div className={`form-step ${currentStep === 1 ? 'active' : 'hidden'}`}>
          <div className="step-content">
            <h3>👤 Personal Details</h3>
            <p className="step-description">Tell us about yourself</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">
                  Age *
                  <span className="field-hint">Must be between 18-65</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your age"
                  min="18"
                  max="65"
                  className={`${errors.age ? 'error' : ''} ${
                    touchedFields.age && !errors.age && formData.age ? 'valid' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
                {touchedFields.age && !errors.age && formData.age && (
                  <span className="success-message">✓ Age verified</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="employment">Employment Status *</label>
                <select
                  id="employment"
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                >
                  {employmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Financial Overview */}
        <div className={`form-step ${currentStep === 2 ? 'active' : 'hidden'}`}>
          <div className="step-content">
            <h3>💰 Financial Overview</h3>
            <p className="step-description">Your monthly income and expenses</p>
            
            <div className="financial-summary">
              {formData.income && formData.expenses && (
                <div className="summary-card">
                  <div className="summary-item">
                    <span>Monthly Disposable Income:</span>
                    <strong>
                      R {(parseFloat(formData.income) - parseFloat(formData.expenses)).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </strong>
                  </div>
                  <div className="summary-item">
                    <span>Expense-to-Income Ratio:</span>
                    <strong>
                      {((parseFloat(formData.expenses) / parseFloat(formData.income)) * 100).toFixed(1)}%
                    </strong>
                  </div>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="income">
                  Monthly Income (ZAR) *
                  <span className="field-hint">After tax</span>
                </label>
                <input
                  type="number"
                  id="income"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter monthly income"
                  min="0"
                  step="100"
                  className={`${errors.income ? 'error' : ''} ${
                    touchedFields.income && !errors.income && formData.income ? 'valid' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.income && <span className="error-message">{errors.income}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="expenses">
                  Monthly Expenses (ZAR) *
                  <span className="field-hint">Rent, bills, etc.</span>
                </label>
                <input
                  type="number"
                  id="expenses"
                  name="expenses"
                  value={formData.expenses}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter monthly expenses"
                  min="0"
                  step="100"
                  className={`${errors.expenses ? 'error' : ''} ${
                    touchedFields.expenses && !errors.expenses && formData.expenses ? 'valid' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.expenses && <span className="error-message">{errors.expenses}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Credit History */}
        <div className={`form-step ${currentStep === 3 ? 'active' : 'hidden'}`}>
          <div className="step-content">
            <h3>📊 Credit History</h3>
            <p className="step-description">Your credit profile information</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="creditScore">
                  Credit Score *
                  <span className="field-hint">300-850</span>
                </label>
                <input
                  type="number"
                  id="creditScore"
                  name="creditScore"
                  value={formData.creditScore}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter credit score"
                  min="300"
                  max="850"
                  className={`${errors.creditScore ? 'error' : ''} ${
                    touchedFields.creditScore && !errors.creditScore && formData.creditScore ? 'valid' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.creditScore && <span className="error-message">{errors.creditScore}</span>}
                {formData.creditScore && !errors.creditScore && (
                  <div className="score-indicator">
                    <div className="score-labels">
                      <span className={parseInt(formData.creditScore) < 600 ? 'poor' : ''}>Poor</span>
                      <span className={parseInt(formData.creditScore) >= 600 && parseInt(formData.creditScore) < 700 ? 'average' : ''}>Fair</span>
                      <span className={parseInt(formData.creditScore) >= 700 && parseInt(formData.creditScore) < 750 ? 'good' : ''}>Good</span>
                      <span className={parseInt(formData.creditScore) >= 750 ? 'excellent' : ''}>Excellent</span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className="score-marker" 
                        style={{
                          left: `${((parseInt(formData.creditScore) - 300) / 550) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="existingDebt">
                  Existing Debt (ZAR) *
                  <span className="field-hint">Total outstanding loans</span>
                </label>
                <input
                  type="number"
                  id="existingDebt"
                  name="existingDebt"
                  value={formData.existingDebt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter total existing debt"
                  min="0"
                  step="100"
                  className={`${errors.existingDebt ? 'error' : ''} ${
                    touchedFields.existingDebt && !errors.existingDebt && formData.existingDebt ? 'valid' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.existingDebt && <span className="error-message">{errors.existingDebt}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Loan Details */}
        <div className={`form-step ${currentStep === 4 ? 'active' : 'hidden'}`}>
          <div className="step-content">
            <h3>🏦 Loan Details</h3>
            <p className="step-description">Tell us what you're applying for</p>
            
            <div className="loan-summary">
              {formData.loanAmount && formData.loanPeriod && (
                <div className="summary-card">
                  <div className="summary-item">
                    <span>Estimated Monthly Payment:</span>
                    <strong>
                      R {(parseFloat(formData.loanAmount) / (parseFloat(formData.loanPeriod) * 12)).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </strong>
                  </div>
                  <div className="summary-item">
                    <span>Total Repayment:</span>
                    <strong>
                      R {(parseFloat(formData.loanAmount) * 1.1).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}*
                    </strong>
                  </div>
                  <small>*Estimated with 10% interest</small>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="loanAmount">
                  Loan Amount Requested (ZAR) *
                  <span className="field-hint">How much you need</span>
                </label>
                <input
                  type="number"
                  id="loanAmount"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter requested loan amount"
                  min="0"
                  step="1000"
                  className={`${errors.loanAmount ? 'error' : ''} ${
                    touchedFields.loanAmount && !errors.loanAmount && formData.loanAmount ? 'valid' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.loanAmount && <span className="error-message">{errors.loanAmount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="loanPeriod">
                  Loan Period (Years) *
                  <span className="field-hint">1-30 years</span>
                </label>
                <input
                  type="number"
                  id="loanPeriod"
                  name="loanPeriod"
                  value={formData.loanPeriod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter loan period"
                  min="1"
                  max="30"
                  className={`${errors.loanPeriod ? 'error' : ''} ${
                    touchedFields.loanPeriod && !errors.loanPeriod && formData.loanPeriod ? 'valid' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.loanPeriod && <span className="error-message">{errors.loanPeriod}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="step-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="prev-step-btn"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={isSubmitting}
            >
              ← Previous Step
            </button>
          )}
          
          {currentStep < 4 && (
            <button 
              type="button" 
              className="next-step-btn"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepAccessible(currentStep + 1) || isSubmitting}
            >
              Next Step →
            </button>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button 
            type="button" 
            className="reset-btn"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Reset Form
          </button>
        </div>
      </form>

      <div className="form-footer">
        <p>* Required fields</p>
        <p>All information is kept confidential and secure</p>
        <p className="disclaimer">Final decision subject to verification and credit checks</p>
      </div>
    </div>
  );
};

export default LoanApplicationForm;