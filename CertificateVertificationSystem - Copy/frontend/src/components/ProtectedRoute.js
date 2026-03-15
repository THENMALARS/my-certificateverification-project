import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // 🚪 NOT AUTHENTICATED → ALWAYS GO TO PUBLIC HOME
  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;;
  }

  // 🚫 NOT ADMIN
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;