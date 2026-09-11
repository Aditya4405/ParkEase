import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  LayoutDashboard, 
  Grid3X3, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Radio
} from 'lucide-react';

const OwnerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Parking Locations', path: '/owner/parking-locations', icon: <Building2 size={18} /> },
    { label: 'Parking Slots', path: '/owner/slots', icon: <Grid3X3 size={18} /> },
    { label: 'Bookings', path: '/owner/bookings', icon: <Calendar size={18} /> },
    { label: 'Revenue', path: '/owner/revenue', icon: <TrendingUp size={18} /> },
    { label: 'Statistics', path: '/owner/statistics', icon: <BarChart3 size={18} /> },
    { label: 'Operator Profile', path: '/owner/profile', icon: <User size={18} /> },
  ];

  const isActive = (path) => location.pathname === path || (path === '/owner/parking-locations' && location.pathname.startsWith('/owner/parking-locations/'));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Sidebar for Desktop */}
      <aside style={{
        width: '260px',
        background: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        color: '#f8fafc'
      }} className="desktop-sidebar">
        
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            fontWeight: 900
          }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              ParkEase <span style={{ color: '#38bdf8' }}>Owner</span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              OWNER PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1.25rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ padding: '0 0.65rem 0.4rem', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Operations
          </div>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active ? '#1e293b' : 'transparent',
                  borderLeft: active ? '3px solid #38bdf8' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: active ? '#38bdf8' : '#64748b' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Owner Footer Profile & Logout */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #1e293b',
          background: '#090d16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', overflow: 'hidden' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#1e293b',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <strong style={{ fontSize: '0.84rem', color: '#ffffff', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Facility Partner'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
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
              padding: '0.55rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#f87171',
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

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="main-content-wrapper">
        
        {/* Top Header */}
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
              className="mobile-toggle-btn"
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
              Operator Control Center
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/owner/parking-locations/create"
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <PlusCircle size={14} />
              <span>Add Parking Facility</span>
            </Link>
          </div>
        </header>

        {/* Page Children */}
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
            background: '#0f172a',
            color: '#ffffff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>ParkEase Owner</strong>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <nav style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                    color: isActive(item.path) ? '#38bdf8' : '#94a3b8',
                    background: isActive(item.path) ? '#1e293b' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar {
            display: none !important;
          }
          .main-content-wrapper {
            margin-left: 0 !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerLayout;
