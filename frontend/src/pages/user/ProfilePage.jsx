import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { User, Mail, Phone, Car, Shield, CheckCircle, Save } from 'lucide-react';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        vehicleNumber: user.vehicleNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await authApi.updateProfile(formData);
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '680px' }}>
      <div className="page-header">
        <h1 className="page-title">
          <User size={32} style={{ color: 'var(--primary)' }} />
          My Profile & Settings
        </h1>
        <p className="page-subtitle">Manage your personal information and default vehicle plate.</p>
      </div>

      <div className="card">
        {/* User Role Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800
          }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
            <div style={{ marginTop: '0.35rem' }}>
              <span className={`badge ${user?.role === 'ADMIN' ? 'badge-danger' : user?.role === 'OWNER' ? 'badge-warning' : 'badge-primary'}`}>
                {user?.role} Role
              </span>
            </div>
          </div>
        </div>

        <ErrorMessage error={error} onDismiss={() => setError(null)} />

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            <span>Your profile has been updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (India)</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Default Vehicle License Plate (India)</label>
            <div style={{ position: 'relative' }}>
              <Car size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="vehicleNumber"
                className="form-input"
                placeholder="e.g. UP 32 EA 4455 / DL 01 AB 8899"
                value={formData.vehicleNumber}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? <LoadingSpinner text="Saving Changes..." /> : (
              <>
                <Save size={17} />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
