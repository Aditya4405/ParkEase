import React from 'react';
import { Car, MapPin, ShieldCheck, Heart } from 'lucide-react';
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
      <div className="container">
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
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  Park<span style={{ color: '#818cf8' }}>Ease</span>
                </span>
                <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700, marginLeft: '6px' }}>
                  INDIA
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' }}>
              Smart Parking for India. Connecting commuters and drivers to verified parking facilities near malls, railway stations, hospitals, and high-density destinations.
            </p>
            <div style={{ fontSize: '0.76rem', color: '#475569' }}>
              Built for parking in India 🇮🇳
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/find-parking" style={{ color: '#94a3b8', textDecoration: 'none' }}>Find Parking</Link></li>
              <li><a href="/#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none' }}>How It Works</a></li>
              <li><a href="/#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Services</a></li>
              <li><a href="/#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About</a></li>
              <li><a href="/#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>For Commuters</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Login</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>Register Free</Link></li>
              <li><Link to="/my-bookings" style={{ color: '#94a3b8', textDecoration: 'none' }}>My Bookings</Link></li>
              <li><Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>User Dashboard</Link></li>
            </ul>
          </div>

          {/* For Facility Owners */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>For Facility Owners</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Owner Login</Link></li>
              <li><Link to="/register-owner" style={{ color: '#94a3b8', textDecoration: 'none' }}>Register as Owner</Link></li>
              <li><Link to="/owner/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Occupancy Control Hub</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '1rem', fontWeight: 700 }}>Legal & Trust</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><span style={{ color: '#64748b' }}>Privacy Policy</span></li>
              <li><span style={{ color: '#64748b' }}>Terms & Conditions</span></li>
              <li><span style={{ color: '#64748b' }}>OpenStreetMap Sourced</span></li>
              <li><span style={{ color: '#64748b' }}>Zero Double-Booking</span></li>
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
            Smart Parking for India • Lucknow Hub
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
