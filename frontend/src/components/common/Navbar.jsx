import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Car, 
  User, 
  LogOut, 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Building, 
  PlusCircle, 
  ShieldCheck, 
  Users, 
  Menu, 
  X,
  Compass,
  ChevronDown
} from 'lucide-react';
import { INDIAN_CITIES } from '../../data/indianDestinations';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCity, setActiveCity] = useState('Lucknow');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo & India Flag Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'var(--text-main)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)'
            }}>
              <Car size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                  Park<span style={{ color: 'var(--primary)' }}>Ease</span>
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  border: '1px solid #fde68a'
                }}>
                  INDIA 🇮🇳
                </span>
              </div>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.02em', marginTop: '-2px' }}>
                Smart Parking for India
              </span>
            </div>
          </Link>

          {/* Quick City Switcher Dropdown */}
          <div style={{ position: 'relative' }} className="desktop-nav">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: '#f8fafc',
                border: '1px solid var(--border)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <MapPin size={13} style={{ color: 'var(--primary)' }} />
              <span>{activeCity}</span>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
            </button>

            {showCityDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '180px',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem 0',
                  zIndex: 110,
                }}
              >
                <div style={{ padding: '0.35rem 0.85rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Select Metro / Hub
                </div>
                {INDIAN_CITIES.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => {
                      setActiveCity(c.name);
                      setShowCityDropdown(false);
                      navigate(`/parking-lots?city=${encodeURIComponent(c.name)}`);
                    }}
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.82rem',
                      fontWeight: activeCity === c.name ? 700 : 500,
                      color: activeCity === c.name ? 'var(--primary)' : 'var(--text-main)',
                      background: activeCity === c.name ? 'var(--primary-light)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{c.name}</span>
                    {c.isPrimary && (
                      <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>Hub</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }} className="desktop-nav">
          <Link 
            to="/parking-lots" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive('/parking-lots') ? 'var(--primary)' : 'var(--text-main)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: isActive('/parking-lots') ? 'var(--primary-light)' : 'transparent'
            }}
          >
            <Compass size={17} />
            Find Parking
          </Link>

          {isAuthenticated && role === 'USER' && (
            <>
              <Link 
                to="/dashboard" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive('/dashboard') ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>
              <Link 
                to="/my-bookings" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isActive('/my-bookings') ? 'var(--primary)' : 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive('/my-bookings') ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <Calendar size={17} />
                My Bookings
              </Link>
            </>
          )}

          {isAuthenticated && role === 'OWNER' && (
            <>
              <Link 
                to="/owner/dashboard" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isActive('/owner/dashboard') ? 'var(--primary)' : 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive('/owner/dashboard') ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <LayoutDashboard size={17} />
                Owner Hub
              </Link>
              <Link 
                to="/owner/lots" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isActive('/owner/lots') ? 'var(--primary)' : 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive('/owner/lots') ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <Building size={17} />
                Parking Lots
              </Link>
              <Link 
                to="/owner/create-lot" 
                className="btn btn-primary btn-sm"
              >
                <PlusCircle size={15} />
                List New Lot
              </Link>
            </>
          )}

          {isAuthenticated && role === 'ADMIN' && (
            <>
              <Link 
                to="/admin/dashboard" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isActive('/admin/dashboard') ? 'var(--primary)' : 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive('/admin/dashboard') ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <ShieldCheck size={17} />
                Admin Panel
              </Link>
              <Link 
                to="/admin/users" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isActive('/admin/users') ? 'var(--primary)' : 'var(--text-main)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive('/admin/users') ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <Users size={17} />
                Users & Roles
              </Link>
            </>
          )}

          {/* Auth Action Buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <Link 
                to="/profile" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#f1f5f9',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  border: '1px solid var(--border)'
                }}
              >
                <User size={16} style={{ color: 'var(--primary)' }} />
                <span>{user?.name?.split(' ')[0]}</span>
                <span className={`badge ${role === 'ADMIN' ? 'badge-danger' : role === 'OWNER' ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                  {role}
                </span>
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
                style={{ color: 'var(--text-muted)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-only"
          style={{
            display: 'none',
            padding: '0.5rem',
            color: 'var(--text-main)',
          }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid var(--border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <Link
            to="/parking-lots"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
          >
            <Compass size={18} />
            Find Parking
          </Link>

          {isAuthenticated ? (
            <>
              {role === 'USER' && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
                  >
                    <LayoutDashboard size={18} />
                    User Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
                  >
                    <Calendar size={18} />
                    My Bookings
                  </Link>
                </>
              )}
              {role === 'OWNER' && (
                <>
                  <Link
                    to="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
                  >
                    <LayoutDashboard size={18} />
                    Owner Dashboard
                  </Link>
                  <Link
                    to="/owner/lots"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
                  >
                    <Building size={18} />
                    My Parking Lots
                  </Link>
                </>
              )}
              {role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
                  >
                    <ShieldCheck size={18} />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
                  >
                    <Users size={18} />
                    User Management
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', fontWeight: 600 }}
              >
                <User size={18} />
                My Profile ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-danger-outline"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <LogOut size={16} />
                Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
