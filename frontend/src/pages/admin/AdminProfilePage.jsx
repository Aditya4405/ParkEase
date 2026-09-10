import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { ShieldCheck, Mail, Phone, CheckCircle, Save } from 'lucide-react';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Master Admin Credentials
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Root account settings and administrative contact details.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', borderTop: '4px solid #f43f5e' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #be123c 0%, #4f46e5 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800
          }}>
            <ShieldCheck size={36} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.2rem 0' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span className="badge badge-danger">Root Administrator</span>
              <span className="badge badge-success">Full System Access</span>
            </div>
          </div>
        </div>

        <ErrorMessage error={error} onDismiss={() => setError(null)} />

        {success && (
          <div style={{ background: 'var(--success-subtle)', color: 'var(--success)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} />
            <span>Administrator profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Admin Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Official Admin Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Direct Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem' }}
            disabled={loading}
          >
            {loading ? <LoadingSpinner text="Saving Changes..." /> : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <Save size={16} />
                <span>Save Admin Profile</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfilePage;
