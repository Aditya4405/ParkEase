import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  LayoutDashboard, 
  Clock, 
  FileText, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Car,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';

const PartnerApplicationLayout = ({ children, pageTitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Partner Dashboard', path: '/partner/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Application Status', path: '/partner/status', icon: <Clock size={18} /> },
    { label: 'Application Form', path: '/owner/apply', icon: <FileText size={18} /> },
    { label: 'Find Parking', path: '/find-parking', icon: <Search size={18} /> },
    { label: 'Account Profile', path: '/profile', icon: <User size={18} /> },
  ];

  const isNavActive = (itemPath) => {
    const p = location.pathname;
    if (itemPath === '/partner/status') {
      return p === '/partner/status' || p === '/partner/application';
    }
    if (itemPath === '/owner/apply') {
      return p === '/owner/apply' || p === '/owner-registration';
    }
    return p === itemPath;
  };

  const getHeaderTitle = () => {
    if (pageTitle) return pageTitle;
    const p = location.pathname;
    if (p === '/partner/dashboard') return 'Partner Applicant Dashboard';
    if (p === '/partner/status' || p === '/partner/application') return 'Application Status & Verification Timeline';
    if (p === '/owner/apply') return 'Become a Parking Partner';
    if (p === '/profile') return 'Account Profile';
    return 'Partner Application Portal';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Sidebar for Desktop */}
      <aside style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
      }} className="desktop-partner-sidebar">
        
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}>
            <Briefcase size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              ParkEase <span style={{ color: '#0284c7' }}>Partner</span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              PARTNER APPLICATION
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1.25rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          <div style={{ padding: '0 0.65rem 0.4rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Application Portal
          </div>

          {navItems.map((item) => {
            const active = isNavActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#0284c7' : '#334155',
                  background: active ? '#f0f9ff' : 'transparent',
                  borderLeft: active ? '3px solid #0284c7' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: active ? '#0284c7' : '#64748b' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile & Logout */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', overflow: 'hidden' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Partner Applicant'}
              </strong>
              <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block' }}>
                Partner Applicant
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#dc2626',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="main-content-wrapper">
        
        {/* Top Header Bar */}
        <header style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-partner-toggle-btn"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {getHeaderTitle()}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              border: '1px solid #bae6fd',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <ShieldCheck size={14} /> Partner Applicant Portal
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '1.75rem' }}>
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          zIndex: 100,
          display: 'flex'
        }}>
          <div style={{
            width: '280px',
            background: '#ffffff',
            color: '#0f172a',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>ParkEase Partner</strong>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <nav style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    color: isNavActive(item.path) ? '#0284c7' : '#334155',
                    background: isNavActive(item.path) ? '#f0f9ff' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-partner-sidebar {
            display: none !important;
          }
          .main-content-wrapper {
            margin-left: 0 !important;
          }
          .mobile-partner-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PartnerApplicationLayout;
