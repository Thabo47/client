import React, { useState } from 'react';
import './LoanApplicationForm.css';

const LoanApplicationForm = ({ onSubmit }) => {
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

  const employmentTypes = [
    { value: 'employed', label: 'Employed' },
    { value: 'self_employed', label: 'Self Employed' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.age || formData.age < 18 || formData.age > 65) {
      newErrors.age = 'Age must be between 18 and 65';
    }

    if (!formData.income || formData.income <= 0) {
      newErrors.income = 'Monthly income must be greater than 0';
    }

    if (!formData.expenses || formData.expenses < 0) {
      newErrors.expenses = 'Monthly expenses must be a valid number';
    }

    if (!formData.creditScore || formData.creditScore < 300 || formData.creditScore > 850) {
      newErrors.creditScore = 'Credit score must be between 300 and 850';
    }

    if (!formData.existingDebt || formData.existingDebt < 0) {
      newErrors.existingDebt = 'Existing debt must be a valid number';
    }

    if (!formData.loanAmount || formData.loanAmount <= 0) {
      newErrors.loanAmount = 'Loan amount must be greater than 0';
    }

    if (!formData.loanPeriod || formData.loanPeriod < 1 || formData.loanPeriod > 30) {
      newErrors.loanPeriod = 'Loan period must be between 1 and 30 years';
    }

    // Check if expenses exceed income
    if (parseFloat(formData.expenses) > parseFloat(formData.income)) {
      newErrors.expenses = 'Monthly expenses cannot exceed monthly income';
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
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Loan Application Form</h2>
        <p>Please fill in all the required information accurately</p>
      </div>

      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="18"
              max="65"
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="employment">Employment Status *</label>
            <select
              id="employment"
              name="employment"
              value={formData.employment}
              onChange={handleChange}
            >
              {employmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="income">Monthly Income (ZAR) *</label>
            <input
              type="number"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              placeholder="Enter monthly income"
              min="0"
              step="100"
              className={errors.income ? 'error' : ''}
            />
            {errors.income && <span className="error-message">{errors.income}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="expenses">Monthly Expenses (ZAR) *</label>
            <input
              type="number"
              id="expenses"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              placeholder="Enter monthly expenses"
              min="0"
              step="100"
              className={errors.expenses ? 'error' : ''}
            />
            {errors.expenses && <span className="error-message">{errors.expenses}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creditScore">Credit Score *</label>
            <input
              type="number"
              id="creditScore"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              placeholder="Enter credit score (300-850)"
              min="300"
              max="850"
              className={errors.creditScore ? 'error' : ''}
            />
            {errors.creditScore && <span className="error-message">{errors.creditScore}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="existingDebt">Existing Debt (ZAR) *</label>
            <input
              type="number"
              id="existingDebt"
              name="existingDebt"
              value={formData.existingDebt}
              onChange={handleChange}
              placeholder="Enter total existing debt"
              min="0"
              step="100"
              className={errors.existingDebt ? 'error' : ''}
            />
            {errors.existingDebt && <span className="error-message">{errors.existingDebt}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="loanAmount">Loan Amount Requested (ZAR) *</label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="Enter requested loan amount"
              min="0"
              step="1000"
              className={errors.loanAmount ? 'error' : ''}
            />
            {errors.loanAmount && <span className="error-message">{errors.loanAmount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="loanPeriod">Loan Period (Years) *</label>
            <input
              type="number"
              id="loanPeriod"
              name="loanPeriod"
              value={formData.loanPeriod}
              onChange={handleChange}
              placeholder="Enter loan period in years"
              min="1"
              max="30"
              className={errors.loanPeriod ? 'error' : ''}
            />
            {errors.loanPeriod && <span className="error-message">{errors.loanPeriod}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Application
          </button>
          <button type="button" className="reset-btn" onClick={() => {
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
          }}>
            Reset Form
          </button>
        </div>
      </form>

      <div className="form-footer">
        <p>* Required fields</p>
        <p>All information is kept confidential and secure</p>
      </div>
    </div>
  );
};

export default LoanApplicationForm;