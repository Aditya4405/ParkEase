import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { User, Mail, Lock, Phone, Car, ArrowRight } from 'lucide-react';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleNumber: '',
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
      const response = await authApi.registerUser(formData);
      const { token, ...userData } = response.data;
      saveAuth(token, userData);
      navigate('/dashboard', { replace: true });
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
            background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <Car size={26} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>🇮🇳 India Free Registration</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Driver Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Instant access to reserve parking spaces in Lucknow & across India
          </p>
        </div>

        <ErrorMessage error={error} onDismiss={() => setError(null)} />

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Amit Verma"
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
                placeholder="amit.verma@example.com"
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

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone (India)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Plate</label>
              <div style={{ position: 'relative' }}>
                <Car size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="vehicleNumber"
                  className="form-input"
                  placeholder="UP 32 EA 4455"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <LoadingSpinner text="Creating Account..." /> : (
              <>
                <span>Create Driver Account</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
          <div style={{ marginTop: '0.35rem' }}>
            <Link to="/register-owner" style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>
              Are you a parking lot owner? Register here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
