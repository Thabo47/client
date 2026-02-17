import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Notifications from './components/Notifications';
import LoadingOverlay from './components/LoadingOverlay';
import HomePage from './components/HomePage';
import LoanResult from './components/LoanResult';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ChatAssistant from './components/ChatAssistant';

function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState('home');
  
  // Loan application state
  const [loanResult, setLoanResult] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Tool visibility state
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // User preferences state
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedRecentApps = JSON.parse(localStorage.getItem('recentApplications') || '[]');
    setDarkMode(savedDarkMode);
    setRecentApplications(savedRecentApps);
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Notification handlers
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Form submission handler
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setApplicationData(formData);
    
    try {
      const response = await fetch('http://localhost:5000/api/evaluate-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setLoanResult(data);
      setCurrentView('result');
      
      // Save to recent applications
      const newRecent = [{
        id: Date.now(),
        date: new Date().toISOString(),
        amount: formData.loanAmount,
        decision: data.decision
      }, ...recentApplications.slice(0, 4)];
      setRecentApplications(newRecent);
      localStorage.setItem('recentApplications', JSON.stringify(newRecent));
      
      addNotification('Application processed successfully!', 'success');
    } catch (error) {
      console.error('Error:', error);
      setLoanResult({
        success: false,
        decision: 'error',
        reason: 'Failed to process application. Please try again.'
      });
      setCurrentView('result');
      addNotification('Error processing application', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewApplication = () => {
    setLoanResult(null);
    setApplicationData(null);
    setCurrentView('home');
    addNotification('Starting new application', 'info');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Tool handlers
  const handleCalculatorApply = (calculation) => {
    addNotification('Calculator values ready to apply', 'success');
  };

  const handleScoreApply = (score) => {
    addNotification(`Credit score ${score} ready to apply`, 'success');
  };

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  const toggleSimulator = () => {
    setShowSimulator(!showSimulator);
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      <Notifications 
        notifications={notifications} 
        onRemove={removeNotification}
      />
      
      <main className="main-content">
        {loading && <LoadingOverlay />}
        
        {currentView === 'home' && (
          <HomePage 
            onFormSubmit={handleFormSubmit}
            onCalculatorApply={handleCalculatorApply}
            onScoreApply={handleScoreApply}
            showCalculator={showCalculator}
            showSimulator={showSimulator}
            showComparison={showComparison}
            onToggleCalculator={toggleCalculator}
            onToggleSimulator={toggleSimulator}
            onToggleComparison={toggleComparison}
            recentApplications={recentApplications}
          />
        )}
        
        {currentView === 'result' && loanResult && applicationData && (
          <LoanResult 
            result={loanResult}
            applicationData={applicationData}
            onNewApplication={handleNewApplication}
          />
        )}

        {currentView === 'about' && <AboutPage />}
        
        {currentView === 'contact' && <ContactPage />}
      </main>
      
      <ChatAssistant />
      <Footer />
    </div>
  );
}

export default App;