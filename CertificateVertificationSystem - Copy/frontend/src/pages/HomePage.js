import React from 'react';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Hi, {user?.name || 'Admin'} Welcome to CertVeri!
        </h1>
      </div>

      {/* Main Feature Card */}
      <div className="feature-main-card">
        <h2 className="feature-main-title">
          CertVeri - verifies certificate securely
        </h2>
        <div className="feature-list">
          <p className="feature-item">✓ Verifies certificate using unique IDs</p>
          <p className="feature-item">✓ Web based platform to detect and verify the certificates</p>
          <p className="feature-item">✓ Builds trust amongst organizations</p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Stored Securely</h3>
          <p className="feature-description">
            All certificates are encrypted and stored with enterprise-grade security
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Verified instantly</h3>
          <p className="feature-description">
            Instant verification through unique IDs and QR codes
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3 className="feature-title">Authenticates users</h3>
          <p className="feature-description">
            Secure authentication system ensures only verified users
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;