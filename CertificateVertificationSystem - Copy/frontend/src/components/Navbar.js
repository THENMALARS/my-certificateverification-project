import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎓 CertVerify
        </Link>

        <ul className="navbar-menu">
          {/* PUBLIC */}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/" className="navbar-link">
                  Search Certificate
                </Link>
              </li>
              <li>
                <Link to="/admin/signin" className="btn btn-primary">
                  Sign in
                </Link>
              </li>
            </>
          )}

          {/* ADMIN */}
          {isAuthenticated && isAdmin && (
            <>
              <li>
                <Link to="/admin/search" className="navbar-link">
                  Search Certificate
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/upload" className="navbar-link">
                  Upload Certificates
                </Link>
              </li>
              <li>
                <Link to="/admin/certificates" className="navbar-link">
                  All Certificates
                </Link>
              </li>
              <li>
                <span className="navbar-link" style={{ cursor: 'default' }}>
                  👤 {user?.name}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;