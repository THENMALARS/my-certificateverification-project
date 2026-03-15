import React from 'react';
import Navbar from '../components/Navbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <Navbar />
      
      {/* Hero Text - Added */}
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem 2rem 2rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '600', 
          color: 'white', 
          marginBottom: '0.5rem', 
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.5px'
        }}>
          Verify the certificate with comfort
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'rgba(255, 255, 255, 0.85)', 
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)'
        }}>
          Trusted by professionals
        </p>
      </div>
      
      {children}
    </div>
  );
};

export default PublicLayout;