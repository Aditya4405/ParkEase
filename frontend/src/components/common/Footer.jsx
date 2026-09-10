import React from 'react';
import { Car, ShieldCheck, Clock, MapPin, Heart, Zap, CreditCard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--dark-bg)',
      color: 'var(--dark-text)',
      padding: '4.5rem 0 2rem',
      borderTop: '1px solid var(--dark-border)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Car size={22} />
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
            <p style={{ color: 'var(--dark-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
              India's smart parking discovery & slot reservation network. Connecting drivers to secure parking across Lucknow, Delhi NCR, Kanpur, Ayodhya and major Indian hubs.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#cbd5e1' }}>
                UPI & Fastag Ready
              </span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#cbd5e1' }}>
                EV Charging Bays
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 700 }}>Explore Hubs</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/parking-lots?city=Lucknow" style={{ color: 'var(--dark-muted)' }}>Lucknow Parking (Phoenix, Lulu, Charbagh)</Link></li>
              <li><Link to="/parking-lots?city=Noida" style={{ color: 'var(--dark-muted)' }}>Noida & DLF Mall of India</Link></li>
              <li><Link to="/parking-lots?city=Delhi" style={{ color: 'var(--dark-muted)' }}>Delhi NCR Transit Parking</Link></li>
              <li><Link to="/parking-lots?city=Ayodhya" style={{ color: 'var(--dark-muted)' }}>Ayodhya Dham Pilgrim Parking</Link></li>
              <li><Link to="/register-owner" style={{ color: '#818cf8', fontWeight: 600 }}>+ List Your Commercial Space</Link></li>
            </ul>
          </div>

          {/* Key Advantages */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 700 }}>India-First Features</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--dark-muted)', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={17} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={17} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <span>Instant QR Pass & Entry Code</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Zap size={17} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <span>Dedicated EV Charging Slot Reservations</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CreditCard size={17} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <span>Indian Currency (₹) Hourly & Daily Tariffs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid var(--dark-border)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--dark-muted)'
        }}>
          <p>© {new Date().getFullYear()} ParkEase India Technologies. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built for Smart Cities & Seamless Urban Mobility in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
