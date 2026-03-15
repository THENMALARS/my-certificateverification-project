import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import AdminSignIn from './pages/AdminSignIn';
import AdminSignUp from './pages/AdminSignUp';
import HomePage from './pages/HomePage';
import SearchCertificate from './pages/SearchCertificate';
import Dashboard from './pages/Dashboard';
import UploadCertificates from './pages/UploadCertificates';
import AllCertificates from './pages/AllCertificates';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import VerifyCertificate from './pages/VerifyCertificate'; // ← NEW IMPORT

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <SearchCertificate />
              </PublicLayout>
            }
          />

          <Route
            path="/search"
            element={
              <PublicLayout>
                <SearchCertificate />
              </PublicLayout>
            }
          />

          {/* ================= VERIFY ROUTE ================= */}
          <Route
            path="/verify/:id"
            element={
              <PublicLayout>
                <VerifyCertificate />
              </PublicLayout>
            }
          />

          {/* ================= AUTH ================= */}
          <Route
            path="/admin/signin"
            element={
              <AuthLayout>
                <AdminSignIn />
              </AuthLayout>
            }
          />

          <Route
            path="/admin/signup"
            element={
              <AuthLayout>
                <AdminSignUp />
              </AuthLayout>
            }
          />
<Route path="/logout" element={<Logout />} />
          {/* ================= ADMIN ================= */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <div className="admin-layout">
                  <Sidebar />

                  <div className="main-content">
                    <Routes>
                      <Route path="home" element={<HomePage />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="search" element={<SearchCertificate />} />
                      <Route path="upload" element={<UploadCertificates />} />
                      <Route path="certificates" element={<AllCertificates />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="" element={<Navigate to="/admin/home" replace />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

        <ToastContainer theme="dark" />
      </Router>
    </AuthProvider>
  );
}

export default App;