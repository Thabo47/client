import React, { useEffect } from 'react';
import './Notifications.css';

const Notifications = ({ notifications, onRemove }) => {
  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
          onClick={() => onRemove(notification.id)}
        >
          <span className="notification-icon">{getIcon(notification.type)}</span>
          <span className="notification-message">{notification.message}</span>
          <button className="notification-close">✕</button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;