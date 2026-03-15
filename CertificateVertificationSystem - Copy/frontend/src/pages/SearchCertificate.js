import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const SearchCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setCertificate(null);

    try {
      const response = await axios.get(`/certificates/search/${certificateId}`);
      setCertificate(response.data.data);
      toast.success('Certificate found!');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Certificate not found'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `/certificates/download/${certificate.certificateId}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificate.certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };
<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
  <h1>Verify the certificate with comfort</h1>
  <p>Trusted by professionals</p>
</div>
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header" style={{ textAlign: 'center' }}>
          <h1 className="card-title">🔍 Search Certificate</h1>
          <p className="card-subtitle">
            Enter your certificate ID to view and download your certificate
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Certificate ID (e.g., CERT2024001)"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {certificate && (
          <>
            <div className="certificate">
              <div className="cert-header">
                <div className="cert-title">Certificate</div>
                <div className="cert-subtitle">of Internship Completion</div>
              </div>

              <div className="cert-body">
                <p>This is to certify that</p>
                <div className="student-name">{certificate.studentName}</div>
                <p>has successfully completed the internship program in</p>
                <div className="domain">{certificate.domain}</div>
                <p style={{ marginTop: '2rem' }}>
                  This internship was conducted with dedication and professionalism,
                  demonstrating excellent skills and commitment.
                </p>
              </div>

              <div className="cert-footer">
                <div className="cert-field">
                  <div className="cert-label">Certificate ID</div>
                  <div className="cert-value">{certificate.certificateId}</div>
                </div>
                <div className="cert-field">
                  <div className="cert-label">Start Date</div>
                  <div className="cert-value">{certificate.startDate}</div>
                </div>
                <div className="cert-field">
                  <div className="cert-label">End Date</div>
                  <div className="cert-value">{certificate.endDate}</div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleDownload} className="btn btn-primary">
                📥 Download PDF
              </button>
              <button onClick={handlePrint} className="btn btn-secondary">
                🖨️ Print
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchCertificate;