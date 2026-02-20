import React from 'react';

function LoadingSkeleton() {
  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ 
        width: '60%', 
        height: '40px', 
        background: 'linear-gradient(90deg, var(--gray-light) 25%, var(--off-white) 50%, var(--gray-light) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        margin: '0 auto 2rem',
        borderRadius: '10px'
      }} />
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            height: '60px',
            background: 'linear-gradient(90deg, var(--gray-light) 25%, var(--off-white) 50%, var(--gray-light) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '10px',
            animationDelay: `${i * 0.2}s`
          }} />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;