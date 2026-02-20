import React, { useState, useEffect } from 'react';
import './App.css';
import LoanApplicationForm from './components/LoanApplicationForm';
import LoanResult from './components/LoanResult';
import LoanHistory from './components/LoanHistory';
import Navigation from './components/Navigation';
import LoanCalculator from './components/LoanCalculator';
import EligibilityChecker from './components/EligibilityChecker';
import LoanComparison from './components/LoanComparison';

function App() {
  const [currentPage, setCurrentPage] = useState('apply');
  const [loanResult, setLoanResult] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  
  // Tool visibility states
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);
  const [showLoanComparison, setShowLoanComparison] = useState(false);
  
  // Pre-filled application data from tools
  const [prefilledAmount, setPrefilledAmount] = useState(null);
  const [selectedLoanProduct, setSelectedLoanProduct] = useState(null);

  // Load applications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('loanApplications');
    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('loanApplications', JSON.stringify(applications));
  }, [applications]);

  const handleFormSubmit = async (formData) => {
    setApplicationData(formData);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/evaluate-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.error) {
        setError(data.error);
        if (data.details) {
          setError(`${data.error}: ${data.details}`);
        }
        setLoanResult('error');
      } else {
        setLoanResult(data.decision);
        
        // Save to history
        const newApplication = {
          ...formData,
          result: data.decision,
          date: new Date().toISOString(),
          id: Date.now()
        };
        setApplications(prev => [newApplication, ...prev]);
        
        setCurrentPage('result');
      }
    } catch (error) {
      console.error('Error:', error);
      
      if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to the server. Please make sure the backend server is running on port 3001.');
      } else {
        setError(error.message);
      }
      
      setLoanResult('error');
      setCurrentPage('result');
    }
  };

  const handleNewApplication = () => {
    setCurrentPage('apply');
    setLoanResult(null);
    setApplicationData(null);
    setError('');
    setSelectedHistoryItem(null);
    setPrefilledAmount(null);
    setSelectedLoanProduct(null);
  };

  const handleViewHistoryDetails = (app) => {
    setSelectedHistoryItem(app);
    setApplicationData(app);
    setLoanResult(app.result);
    setCurrentPage('result');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setApplications([]);
    }
  };

  // Close all overlays helper
  const closeAllOverlays = () => {
    setShowCalculator(false);
    setShowEligibilityChecker(false);
    setShowLoanComparison(false);
  };

  // Tool handlers
  const handleCalculatorApply = (amount) => {
    setPrefilledAmount(amount);
    closeAllOverlays();
    setCurrentPage('apply');
  };

  const handleEligibilityProceed = () => {
    closeAllOverlays();
    setCurrentPage('apply');
  };

  const handleLoanSelect = (product, amount) => {
    setSelectedLoanProduct(product);
    setPrefilledAmount(amount);
    closeAllOverlays();
    setCurrentPage('apply');
  };

  const handleCloseTool = () => {
    closeAllOverlays();
  };

  // Render tool overlay
  const renderToolOverlay = () => {
    let content = null;
    let maxWidth = '600px';

    if (showCalculator) {
      content = <LoanCalculator onApplyWithAmount={handleCalculatorApply} />;
    } else if (showEligibilityChecker) {
      content = <EligibilityChecker onProceedToApplication={handleEligibilityProceed} />;
    } else if (showLoanComparison) {
      content = <LoanComparison onSelectLoan={handleLoanSelect} />;
      maxWidth = '800px';
    }

    if (!content) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '2rem 1rem',
          overflowY: 'auto'
        }}
        onClick={handleCloseTool}
      >
        <div
          style={{ position: 'relative', width: '100%', maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCloseTool}
            style={{
              position: 'absolute',
              top: '-40px',
              right: '0',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 2001
            }}
          >
            ×
          </button>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        applicationCount={applications.length}
      />
      
      {/* Tools Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa, #fff)',
        padding: '1rem',
        borderBottom: '2px solid #FFB347'
      }}>
        <div className="container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCalculator(true)}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'white',
              border: '2px solid #FF6B35',
              borderRadius: '25px',
              color: '#C41E3A',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: '1 1 auto'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#FF6B35'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#C41E3A'; }}
          >
            Loan Calculator
          </button>
          
          <button
            onClick={() => setShowEligibilityChecker(true)}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'white',
              border: '2px solid #FFB347',
              borderRadius: '25px',
              color: '#C41E3A',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: '1 1 auto'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#FFB347'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#C41E3A'; }}
          >
            Check Eligibility
          </button>
          
          <button
            onClick={() => setShowLoanComparison(true)}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'white',
              border: '2px solid #C41E3A',
              borderRadius: '25px',
              color: '#C41E3A',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: '1 1 auto'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#C41E3A'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#C41E3A'; }}
          >
            Compare Loans
          </button>
        </div>
      </div>

      {/* Tool Overlays */}
      {renderToolOverlay()}

      <main className="main-content">
        <div className="container">
          {currentPage === 'apply' && (
            <LoanApplicationForm 
              onSubmit={handleFormSubmit}
              prefilledAmount={prefilledAmount}
              selectedProduct={selectedLoanProduct}
            />
          )}
          
          {currentPage === 'result' && (
            <LoanResult 
              result={loanResult} 
              applicationData={applicationData}
              onNewApplication={handleNewApplication}
              error={error}
            />
          )}
          
          {currentPage === 'history' && (
            <LoanHistory 
              applications={applications}
              onViewDetails={handleViewHistoryDetails}
              onNewApplication={handleNewApplication}
              onClearHistory={handleClearHistory}
            />
          )}
          
          {currentPage === 'about' && (
            <div className="about-section">
              <h1 className="page-title">About Motsitseng Financial Services</h1>
              <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '2rem', color: '#C41E3A' }}>Motsitseng Financial Services</h2>
                </div>
                
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  Motsitseng Financial Services (MFS) is a leading financial institution committed to 
                  providing accessible and responsible lending solutions. With over 10 years of experience,
                  we've helped thousands of customers achieve their financial goals through transparent
                  and fair lending practices.
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF6B35' }}>10,000+</p>
                    <p>Loans Approved</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FFB347' }}>4.8/5</p>
                    <p>Customer Rating</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#C41E3A' }}>24h</p>
                    <p>Fast Approval</p>
                  </div>
                </div>
                
                <h3 style={{ color: '#C41E3A', marginBottom: '1rem', textAlign: 'center' }}>
                  Our Assessment Criteria
                </h3>
                
                <ul className="feature-list" style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ margin: '0.5rem 0' }}>• Balance risk assessment</li>
                  <li style={{ margin: '0.5rem 0' }}>• Fair lending practices</li>
                  <li style={{ margin: '0.5rem 0' }}>• Profitability analysis</li>
                  <li style={{ margin: '0.5rem 0' }}>• Regulatory compliance</li>
                  <li style={{ margin: '0.5rem 0' }}>• Credit history evaluation</li>
                  <li style={{ margin: '0.5rem 0' }}>• Personalized solutions</li>
                </ul>
                
                <div style={{
                  background: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginTop: '2rem'
                }}>
                  <h4 style={{ color: '#FF6B35', marginBottom: '1rem', textAlign: 'center' }}>
                    Why Choose MFS?
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <strong>Fast Approval</strong>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <strong>Competitive Rates</strong>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <strong>Personal Service</strong>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <strong>Secure Process</strong>
                    </div>
                  </div>
                </div>
                
                <p style={{ 
                  marginTop: '2rem', 
                  color: '#666', 
                  fontStyle: 'italic',
                  textAlign: 'center' 
                }}>
                  We believe in empowering our customers through transparent and fair lending decisions.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #C41E3A, #FF6B35)',
        color: 'white',
        padding: '2rem 1rem',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Motsitseng Financial Services</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Your trusted partner in financial growth and stability since 2015.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Contact Us</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>123 Business Avenue, Johannesburg</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>+27 (0) 11 123 4567</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>info@mfs.co.za</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Business Hours</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Monday - Friday: 8:00 - 17:00</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Saturday: 9:00 - 13:00</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Sunday: Closed</p>
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            <p>© 2025 Motsitseng Financial Services. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem' }}>
              NCR Reg No: MFS123456 | FSP No: 48732
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;