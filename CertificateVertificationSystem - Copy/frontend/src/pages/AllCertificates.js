import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AllCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCertificates();
  }, [page, search]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/certificates', {
        params: {
          page,
          limit: 10,
          search: search || undefined,
        },
      });

      setCertificates(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCertificates();
  };

  const handleDelete = async (id, certificateId) => {
    if (window.confirm(`Are you sure you want to delete certificate ${certificateId}?`)) {
      try {
        await axios.delete(`/certificates/${id}`);
        toast.success('Certificate deleted successfully');
        fetchCertificates();
      } catch (error) {
        toast.error('Failed to delete certificate');
      }
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      const response = await axios.get(
        `/certificates/download/${certificateId}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Certificate downloaded');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  if (loading && certificates.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📋 All Certificates</h1>
          <p className="card-subtitle">
            Manage and view all uploaded certificates
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Certificate ID or Student Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            {search && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {certificates.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Student Name</th>
                    <th>Domain</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Downloads</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr key={cert._id}>
                      <td>
                        <strong>{cert.certificateId}</strong>
                      </td>
                      <td>{cert.studentName}</td>
                      <td>{cert.domain}</td>
                      <td>{cert.startDate}</td>
                      <td>{cert.endDate}</td>
                      <td>{cert.downloadCount}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            onClick={() => handleDownload(cert.certificateId)}
                          >
                            📥
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            onClick={() => handleDelete(cert._id, cert.certificateId)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem' }}>No certificates found</p>
            {search && <p>Try adjusting your search criteria</p>}
            {!search && (
              <a href="/admin/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Upload Certificates
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCertificates;