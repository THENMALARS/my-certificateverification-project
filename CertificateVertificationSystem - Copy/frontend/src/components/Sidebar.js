import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user} = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

const handleLogout = () => {
  navigate('/logout', { replace: true });
};

  const menuItems = [
    {path: '/admin/home', label: 'Home', icon: '🏠' },
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/search', label: 'Search Certificate', icon: '🔍' },  // ← ADMIN SEARCH PAGE
    { path: '/admin/upload', label: 'Upload Certificates', icon: '📤' },
    { path: '/admin/certificates', label: 'All Certificates', icon: '📋' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <>
      {/* Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
            {isOpen ? '✕' : '☰'}
          </button>
          <Link to="/admin/home" className="navbar-brand">
            CertVeri
          </Link>
        </div>

        <div className="navbar-right">
          <span className="user-greeting">Hi, {user?.name || 'Admin'}</span>
          <button onClick={handleLogout} className="btn-signout">
            Sign out
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Menu */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;