import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import './VerifyCertificate.css';

const VerifyCertificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/certificates/search/${id}`);
        
        if (response.data.success) {
          setCertificate(response.data.data);
          setError(false);
        }
      } catch (err) {
        setError(true);
        setCertificate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]); // ← Fixed: added id as dependency

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="verify-container">
        <div className="verify-card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Verifying certificate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="verify-container">
        <div className="verify-card invalid">
          <div className="verify-icon">❌</div>
          <h1 className="verify-title">Invalid Certificate</h1>
          <p className="verify-message">
            Certificate ID <strong>{id}</strong> was not found in our database.
          </p>
          <p className="verify-note">
            This certificate may be fake or the ID may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <div className="verify-card verified">
        <div className="verify-icon">✅</div>
        <h1 className="verify-title">Certificate Verified</h1>
        <p className="verify-message">
          This certificate is authentic and registered in our database.
        </p>

        <div className="certificate-details">
          <div className="detail-row">
            <span className="detail-label">Certificate ID:</span>
            <span className="detail-value">{certificate.certificateId}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Student Name:</span>
            <span className="detail-value">{certificate.studentName}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Domain:</span>
            <span className="detail-value">{certificate.domain}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Start Date:</span>
            <span className="detail-value">{formatDate(certificate.startDate)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">End Date:</span>
            <span className="detail-value">{formatDate(certificate.endDate)}</span>
          </div>

          {certificate.organizationName && (
            <div className="detail-row">
              <span className="detail-label">Organization:</span>
              <span className="detail-value">{certificate.organizationName}</span>
            </div>
          )}
        </div>

        <div className="verify-footer">
          <p>Verified on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;