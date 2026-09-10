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
  ChevronDown,
  Sparkles,
  Info,
  Wrench,
  HelpCircle
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

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

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
        height: '68px',
      }}>
        {/* Left: Brand Logo & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'var(--text-main)'
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
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}>
              <Car size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                  Park<span style={{ color: 'var(--primary)' }}>Ease</span>
                </span>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  border: '1px solid #fde68a'
                }}>
                  INDIA 🇮🇳
                </span>
              </div>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.01em', marginTop: '-2px' }}>
                Smart Parking for India
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="desktop-nav">
          <Link 
            to="/" 
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: isActive('/') ? 'var(--primary)' : '#334155',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              background: isActive('/') ? 'var(--primary-subtle)' : 'transparent'
            }}
          >
            Home
          </Link>

          <Link 
            to="/find-parking" 
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: (isActive('/find-parking') || isActive('/parking-lots')) ? 'var(--primary)' : '#334155',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              background: (isActive('/find-parking') || isActive('/parking-lots')) ? 'var(--primary-subtle)' : 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Compass size={15} />
            <span>Find Parking</span>
          </Link>

          <button
            onClick={() => scrollToSection('how-it-works')}
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: '#334155',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection('services')}
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: '#334155',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Services
          </button>

          <button
            onClick={() => scrollToSection('about')}
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: '#334155',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            About
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: '#334155',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Contact
          </button>

          {/* User Specific Links */}
          {isAuthenticated && role === 'USER' && (
            <>
              <Link 
                to="/dashboard" 
                style={{
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: isActive('/dashboard') ? 'var(--primary)' : '#334155',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  background: isActive('/dashboard') ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                Dashboard
              </Link>
              <Link 
                to="/my-bookings" 
                style={{
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: isActive('/my-bookings') ? 'var(--primary)' : '#334155',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  background: isActive('/my-bookings') ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                My Bookings
              </Link>
            </>
          )}

          {isAuthenticated && role === 'OWNER' && (
            <>
              <Link 
                to="/owner/dashboard" 
                style={{
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: isActive('/owner/dashboard') ? 'var(--primary)' : '#334155',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  background: isActive('/owner/dashboard') ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                Operator Hub
              </Link>
            </>
          )}

          {isAuthenticated && role === 'ADMIN' && (
            <>
              <Link 
                to="/admin/dashboard" 
                style={{
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: isActive('/admin/dashboard') ? 'var(--primary)' : '#334155',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  background: isActive('/admin/dashboard') ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                Admin Center
              </Link>
            </>
          )}
        </div>

        {/* Right: Location Selector + Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          
          {/* Quick City Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.7rem',
                borderRadius: '999px',
                background: '#f8fafc',
                border: '1px solid var(--border)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer'
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
                  top: '115%',
                  right: 0,
                  width: '180px',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '0.4rem 0',
                  zIndex: 110,
                }}
              >
                <div style={{ padding: '0.3rem 0.8rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Select Hub / Metro
                </div>
                {INDIAN_CITIES.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => {
                      setActiveCity(c.name);
                      setShowCityDropdown(false);
                      navigate(`/find-parking?city=${encodeURIComponent(c.name)}`);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem',
                      fontWeight: activeCity === c.name ? 700 : 500,
                      color: activeCity === c.name ? 'var(--primary)' : 'var(--text-main)',
                      background: activeCity === c.name ? 'var(--primary-subtle)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{c.name}</span>
                    {c.hub && (
                      <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 700 }}>Hub</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth Action Buttons */}
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link 
                to="/login" 
                className="btn btn-secondary" 
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.84rem', fontWeight: 600 }}
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary" 
                style={{ padding: '0.45rem 1rem', fontSize: '0.84rem', fontWeight: 700 }}
              >
                Register Free
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link 
                to="/profile" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.84rem', 
                  fontWeight: 600, 
                  color: 'var(--text-main)', 
                  textDecoration: 'none',
                  background: '#f8fafc',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border)'
                }}
              >
                <User size={14} style={{ color: 'var(--primary)' }} />
                <span>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.4rem',
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem', fontWeight: 600, textDecoration: 'none', color: 'var(--text-main)' }}
          >
            Home
          </Link>
          <Link 
            to="/find-parking" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem', fontWeight: 600, textDecoration: 'none', color: 'var(--primary)' }}
          >
            Find Parking
          </Link>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            style={{ padding: '0.5rem', fontWeight: 600, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            style={{ padding: '0.5rem', fontWeight: 600, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            style={{ padding: '0.5rem', fontWeight: 600, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            style={{ padding: '0.5rem', fontWeight: 600, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            Contact
          </button>

          {!isAuthenticated ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ textAlign: 'center' }}>
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>
                Register Free
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                Go to Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger">
                Log Out
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
