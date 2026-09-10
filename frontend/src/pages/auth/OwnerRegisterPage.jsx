import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { Building2, Mail, Lock, Phone, User, ArrowRight, ShieldCheck } from 'lucide-react';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OwnerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.registerOwner(formData);
      const { token, ...userData } = response.data;
      saveAuth(token, userData);
      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}>
            <Building2 size={26} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>🇮🇳 India Facility Owner Onboarding</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>List Your Parking Lot</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Register as a facility operator to monetize and manage slots in India
          </p>
        </div>

        <ErrorMessage error={error} onDismiss={() => setError(null)} />

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Company / Operator Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Rajesh Sharma (Avadh Parking Solutions)"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Business Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="rajesh.sharma@avadhparking.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone Number (India)</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+91 98390 12345"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <LoadingSpinner text="Registering Owner..." /> : (
              <>
                <span>Register Facility Operator</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an owner account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegisterPage;
