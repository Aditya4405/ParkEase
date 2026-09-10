import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Car, 
  LayoutDashboard, 
  Search, 
  CalendarCheck, 
  Clock, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronDown
} from 'lucide-react';

const UserLayout = ({ children, pageTitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Find Parking', path: '/find-parking', icon: <Search size={18} /> },
    { label: 'My Bookings', path: '/my-bookings', icon: <CalendarCheck size={18} /> },
    { label: 'Booking History', path: '/my-bookings', icon: <Clock size={18} /> },
    { label: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  const getActiveTitle = () => {
    if (pageTitle) return pageTitle;
    const p = location.pathname;
    if (p === '/dashboard' || p === '/user/dashboard') return 'Dashboard';
    if (p === '/find-parking' || p.startsWith('/parking-lots') || p === '/user/find-parking') return 'Find Parking';
    if (p === '/my-bookings' || p === '/user/bookings') return 'My Bookings';
    if (p.startsWith('/bookings/') || p.startsWith('/user/bookings/')) return 'Booking Details';
    if (p.startsWith('/payment/')) return 'Payment & Confirmation';
    if (p === '/profile' || p === '/user/profile') return 'User Profile';
    return 'User Portal';
  };

  const isNavActive = (itemPath, index) => {
    const p = location.pathname;
    if (itemPath === '/find-parking') {
      return p === '/find-parking' || p.startsWith('/parking-lots');
    }
    if (itemPath === '/my-bookings' && index === 3) {
      // Booking History duplicate path
      return false;
    }
    if (itemPath === '/dashboard') {
      return p === '/dashboard' || p === '/user/dashboard';
    }
    if (itemPath === '/profile') {
      return p === '/profile' || p === '/user/profile';
    }
    return p === itemPath;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Sidebar for Desktop (260px) */}
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
      }} className="desktop-user-sidebar">
        
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
          }}>
            <Car size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Park<span style={{ color: 'var(--primary)' }}>Ease</span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              USER PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1.25rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ padding: '0 0.65rem 0.4rem', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Menu
          </div>
          {navItems.map((item, idx) => {
            const active = isNavActive(item.path, idx);
            return (
              <Link
                key={`${item.path}-${idx}`}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--primary)' : '#475569',
                  background: active ? '#eff6ff' : 'transparent',
                  borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: active ? 'var(--primary)' : '#64748b' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile & Logout */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#e0e7ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name || 'Commuter'}
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.email}
                </span>
              </div>
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
              border: '1px solid #e2e8f0',
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

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="user-main-wrapper">
        
        {/* Authenticated User Topbar */}
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
          {/* Left: Hamburger + Page Title */}
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
              aria-label="Toggle Navigation"
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {getActiveTitle()}
            </h1>
          </div>

          {/* Right: Notification Bell + User Avatar + Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                position: 'relative',
                padding: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Notifications"
            >
              <Bell size={19} />
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#4f46e5'
              }} />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.82rem'
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }} className="topbar-user-meta">
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                    {user?.name || 'Amit Verma'}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b' }}>
                    USER
                  </span>
                </div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '180px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '0.4rem',
                  zIndex: 60
                }}>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#334155',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    <User size={14} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#334155',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    <CalendarCheck size={14} />
                    <span>My Bookings</span>
                  </Link>
                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.3rem 0' }} />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
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
            background: '#ffffff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.35rem', borderRadius: '6px' }}>
                  <Car size={16} />
                </div>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>ParkEase User</strong>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <nav style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {navItems.map((item, idx) => (
                <Link
                  key={`${item.path}-${idx}`}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    color: isNavActive(item.path, idx) ? 'var(--primary)' : '#334155',
                    background: isNavActive(item.path, idx) ? '#eff6ff' : 'transparent',
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
          .desktop-user-sidebar {
            display: none !important;
          }
          .user-main-wrapper {
            margin-left: 0 !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
          .topbar-user-meta {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserLayout;
