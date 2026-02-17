import React, { useState, useRef, useEffect } from 'react';
import './ChatAssistant.css';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: '👋 Hello! I\'m your MFS Loan Assistant. How can I help you today?',
      options: ['Check eligibility', 'Application status', 'Document requirements', 'Interest rates']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    'eligibility': "To be eligible for a loan, you need:\n• Age between 18-65 years\n• Minimum credit score of 600\n• Stable employment\n• Debt-to-income ratio < 50%\nWould you like me to check your eligibility?",
    'documents': "Required documents:\n• ID document (Green ID/Passport)\n• Latest 3 months bank statements\n• Proof of income (payslips/contract)\n• Proof of residence\n• Existing loan statements (if any)",
    'interest': "Our interest rates start from:\n• Personal loans: 10.5% - 18% p.a.\n• Home loans: 8.5% - 12% p.a.\n• Business loans: 12% - 20% p.a.\nFinal rate depends on your credit profile.",
    'status': "You can check your application status by providing your reference number. Please enter your MFS reference number:",
    'default': "I can help you with:\n• Loan eligibility checks\n• Document requirements\n• Interest rates\n• Application status\n• Payment calculations\nWhat would you like to know?"
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      let response = '';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('eligible') || lowerText.includes('qualify')) {
        response = botResponses.eligibility;
      } else if (lowerText.includes('document') || lowerText.includes('paper')) {
        response = botResponses.documents;
      } else if (lowerText.includes('interest') || lowerText.includes('rate')) {
        response = botResponses.interest;
      } else if (lowerText.includes('status') || lowerText.includes('progress')) {
        response = botResponses.status;
      } else {
        response = botResponses.default;
      }

      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (option) => {
    handleSendMessage(option);
  };

  return (
    <>
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>MFS Loan Assistant</h3>
            <p>Ask me anything about loans</p>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.type === 'bot' && <span className="bot-avatar">🤖</span>}
                  <div className="message-text">
                    <p>{msg.text}</p>
                    {msg.options && (
                      <div className="message-options">
                        {msg.options.map((opt, i) => (
                          <button 
                            key={i} 
                            className="option-btn"
                            onClick={() => handleOptionClick(opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <span className="bot-avatar">🤖</span>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder="Type your question..."
            />
            <button onClick={() => handleSendMessage(inputMessage)}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;