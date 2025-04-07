// Loader.js
import React from 'react';

const Loader = () => (
  <div style={{ textAlign: 'center', padding: '1rem' }}>
    <div className="spinner" style={{
      width: '40px', 
      height: '40px', 
      border: '5px solid #ccc', 
      borderTop: '5px solid #0077cc', 
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: 'auto',
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader;
