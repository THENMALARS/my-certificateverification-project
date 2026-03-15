import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeCertificates: 0,
    totalDownloads: 0,
    activeUsers: 0
  });
  const [domainDistribution, setDomainDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/certificates/stats');
      
      if (response.data.success) {
        setStats({
          totalCertificates: response.data.data.totalCertificates || 0,
          activeCertificates: response.data.data.totalCertificates || 0,
          totalDownloads: 0, // You can add download tracking
          activeUsers: 5 // You can fetch from users collection
        });

        // Calculate domain distribution
        const domains = response.data.data.domainDistribution || [];
        setDomainDistribution(domains);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-icon">📊</div>
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Overview of certificate management system</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card-blue">
          <div className="stat-number">{stats.totalCertificates}</div>
          <div className="stat-label">Total Certificates</div>
        </div>

        <div className="stat-card-blue">
          <div className="stat-number">{stats.activeCertificates}</div>
          <div className="stat-label">Active Certificates</div>
        </div>

        <div className="stat-card-blue">
          <div className="stat-number">{stats.totalDownloads}</div>
          <div className="stat-label">Total Downloads</div>
        </div>

        <div className="stat-card-blue">
          <div className="stat-number">{stats.activeUsers}</div>
          <div className="stat-label">Active Users</div>
        </div>
      </div>

      {/* Domain Distribution Section */}
      <div className="domain-distribution-section">
        <h2 className="section-title">Domain Distribution</h2>
        
        <div className="domain-table-container">
          <table className="domain-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Certificate Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {domainDistribution.length > 0 ? (
                domainDistribution.map((domain, index) => (
                  <tr key={index}>
                    <td className="domain-name">{domain.domain}</td>
                    <td className="domain-count">{domain.count}</td>
                    <td className="domain-percentage">{domain.percentage}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;