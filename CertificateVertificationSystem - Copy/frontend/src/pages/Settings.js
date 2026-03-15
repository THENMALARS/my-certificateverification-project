import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings updated successfully!');
  };

  return (
    <div className="container">

      {/* Wrapper to control heading + card together */}
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        {/* SETTINGS TITLE – closer & styled */}
        <h1
          style={{
            marginBottom: '1rem',
            marginLeft: '0.2rem',
            color: '#d7d5db', // soft purple accent
            fontWeight: '600',
            letterSpacing: '0.5px',
            textShadow: '0 0 10px rgba(167, 139, 250, 0.25)',
          }}
        >
          Settings
        </h1>

        {/* CARD */}
        <div className="card">
          <form onSubmit={handleSave}>

            {/* NAME */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Edit Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Edit Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Edit Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;