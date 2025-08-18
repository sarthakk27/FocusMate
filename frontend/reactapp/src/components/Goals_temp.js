import React from 'react';

const Goals = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>Goals</h1>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#666', margin: '0 0 1rem 0' }}>Coming Soon</h2>
        <p style={{ color: '#999' }}>
          Goal tracking features will be available soon. 
          Set and achieve your study objectives!
        </p>
      </div>
    </div>
  );
};

export default Goals;
