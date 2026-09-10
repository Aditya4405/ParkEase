import React from 'react';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '4rem 0 2rem',
      borderTop: '1px solid #1e293b',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.8rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Car size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Park<span style={{ color: '#818cf8' }}>Ease</span>
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.6', marginBottom: '0.8rem' }}>
              Smart Parking. Better Journeys.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5' }}>
              Connecting drivers to convenient parking and empowering facility operators with modern digital management.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link></li>
              <li><a href="/#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none' }}>How It Works</a></li>
              <li><a href="/#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Services</a></li>
              <li><a href="/#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About</a></li>
              <li><a href="/#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>Account</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Log In</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>Register Free</Link></li>
              <li><Link to="/my-bookings" style={{ color: '#94a3b8', textDecoration: 'none' }}>My Bookings</Link></li>
              <li><Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>User Dashboard</Link></li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>For Partners</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Owner Login</Link></li>
              <li><Link to="/register-owner" style={{ color: '#94a3b8', textDecoration: 'none' }}>Become a Parking Partner</Link></li>
              <li><Link to="/owner/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Operator Control Hub</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><span style={{ color: '#64748b' }}>Privacy Policy</span></li>
              <li><span style={{ color: '#64748b' }}>Terms & Conditions</span></li>
              <li><span style={{ color: '#64748b' }}>Security & Compliance</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            © 2026 ParkEase. All rights reserved.
          </div>
          <div>
            Smart Parking. Better Journeys.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
