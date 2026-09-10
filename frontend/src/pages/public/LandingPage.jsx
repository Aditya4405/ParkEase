import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import ParkingLotCard from '../../components/parking/ParkingLotCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Car, 
  ArrowRight, 
  Building2, 
  Sparkles,
  ShoppingBag,
  Train,
  Activity,
  Store,
  Landmark,
  Compass,
  CreditCard,
  Navigation,
  Star
} from 'lucide-react';
import { 
  INDIAN_CITIES, 
  DESTINATION_CATEGORIES, 
  POPULAR_DESTINATIONS 
} from '../../data/indianDestinations';

const LandingPage = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Lucknow');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedLots = async () => {
      try {
        const res = await parkingApi.searchParkingLots();
        setLots(res.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load parking lots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedLots();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedCity) queryParams.set('city', selectedCity);
    if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
    navigate(`/parking-lots?${queryParams.toString()}`);
  };

  const handleDestinationClick = (dest) => {
    const queryParams = new URLSearchParams();
    queryParams.set('city', dest.city);
    queryParams.set('search', dest.name);
    navigate(`/parking-lots?${queryParams.toString()}`);
  };

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesCity = !selectedCity || d.city.toLowerCase() === selectedCity.toLowerCase() || (selectedCity === 'Delhi NCR' && (d.city === 'Delhi' || d.city === 'Noida'));
    return matchesCategory;
  });

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.14) 0%, rgba(2, 132, 199, 0.06) 45%, #f8fafc 100%)',
          padding: '4.5rem 0 3.5rem',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '920px' }}>
          {/* India Flag & Startup Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              color: 'var(--primary-dark)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              border: '1px solid #c7d2fe',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.08)',
            }}
          >
            <span style={{ fontSize: '1rem' }}>🇮🇳</span>
            <span>ParkEase — Smart Parking for India</span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8' }} />
            <span style={{ color: '#059669' }}>Live Across 10+ Cities</span>
          </div>

          {/* Core Headline */}
          <h1
            style={{
              fontSize: '3.4rem',
              fontWeight: 800,
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              color: '#0f172a',
            }}
          >
            Find Parking.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Reach Faster.
            </span>{' '}
            Park Smarter.
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              marginBottom: '2.25rem',
              maxWidth: '750px',
              margin: '0 auto 2.25rem',
            }}
          >
            Discover and reserve convenient parking near malls, hospitals, railway stations, colleges and popular places across India.
          </p>

          {/* City Quick Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
              Select City:
            </span>
            {INDIAN_CITIES.slice(0, 6).map((c) => (
              <button
                key={c.name}
                type="button"
                className={`city-pill ${selectedCity === c.name ? 'active' : ''}`}
                onClick={() => setSelectedCity(c.name)}
              >
                <MapPin size={13} />
                <span>{c.name}</span>
                {c.isPrimary && <span style={{ fontSize: '0.65rem', opacity: 0.9 }}>• Hub</span>}
              </button>
            ))}
          </div>

          {/* Main Search Component */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel"
            style={{
              padding: '0.85rem',
              display: 'grid',
              gridTemplateColumns: '1.8fr auto auto',
              gap: '0.65rem',
              maxWidth: '820px',
              margin: '0 auto 1.5rem',
              textAlign: 'left',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={19} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder='Search destination (e.g. "Phoenix Palassio", "Charbagh Railway Station", "KGMU", "Hazratganj")'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.6rem', height: '48px', fontSize: '0.95rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ height: '48px', padding: '0 1.75rem' }}>
              <Search size={18} />
              <span>Find Parking</span>
            </button>

            <Link
              to={`/parking-lots?city=${encodeURIComponent(selectedCity)}`}
              className="btn btn-secondary btn-lg"
              style={{ height: '48px', padding: '0 1.25rem' }}
            >
              <Compass size={18} />
              <span>Explore</span>
            </Link>
          </form>

          {/* India Key Value Trust Metrics */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '2.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              fontWeight: 600,
              paddingTop: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={17} style={{ color: '#10b981' }} />
              <span>Zero Double-Booking Guarantee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={17} style={{ color: '#0284c7' }} />
              <span>Transparent Rates in INR (₹)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={17} style={{ color: '#d97706' }} />
              <span>EV Charging Bays Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Parking Destinations (Lucknow & India First) */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  Lucknow & Key Indian Hubs
                </span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)' }}>
                Popular Parking Destinations
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Find verified parking slots near top malls, transit junctions, hospitals and shopping markets.
              </p>
            </div>

            <Link to="/parking-lots" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>View All Locations</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
            {DESTINATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.id === 'malls' && <ShoppingBag size={16} />}
                {cat.id === 'transit' && <Train size={16} />}
                {cat.id === 'hospitals' && <Activity size={16} />}
                {cat.id === 'commercial' && <Store size={16} />}
                {cat.id === 'religious' && <Landmark size={16} />}
                {cat.id === 'all' && <Compass size={16} />}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Destination Cards Grid */}
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '1.5rem',
                }}
              >
                {/* Destination Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {dest.categoryLabel}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.15rem', color: 'var(--text-main)' }}>
                      {dest.name}
                    </h3>
                  </div>

                  <span className={`status-pill ${dest.status === 'AVAILABLE' ? 'available' : 'limited'}`}>
                    <span className="status-indicator-dot" />
                    {dest.availableSlots} Slots Free
                  </span>
                </div>

                {/* Location & Distance */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '0.85rem' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>{dest.area}, <strong>{dest.city}</strong></span>
                  <span style={{ color: 'var(--text-subtle)' }}>•</span>
                  <span style={{ color: '#0284c7', fontWeight: 600 }}>{dest.distanceKm} km away</span>
                </div>

                {/* Features & EV Badge */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {dest.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {f}
                    </span>
                  ))}
                  {dest.hasEV && (
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      <Zap size={11} /> EV Ready ({dest.evCount} bays)
                    </span>
                  )}
                </div>

                {/* Card Bottom: Starting Price & CTA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.9rem',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Starting at
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{dest.startingPrice}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/hr</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDestinationClick(dest)}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.45rem 1rem' }}
                  >
                    <span>View Parking</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Verified Live Database Lots */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-main)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instant Booking
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>Active Smart Parking Facilities</h2>
            </div>
            <Link to="/parking-lots" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Browse All Facilities</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={4} />
          ) : lots.length > 0 ? (
            <div className="grid-4">
              {lots.map((lot) => (
                <ParkingLotCard key={lot.id} lot={lot} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No parking lots available in database yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              4-Step Fast Reservation
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>How ParkEase India Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Reserve your verified slot in 60 seconds and drive straight into your assigned bay.
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', position: 'relative' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                1
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Search Destination</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Look up your destination mall, station, hospital or market in Lucknow & top Indian cities.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                2
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Select Vehicle & Slot</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Pick Car, 2-Wheeler, SUV or EV Charging bay with clear upfront hourly rates in INR (₹).
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                3
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Get Instant Pass</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Receive digital parking slip with slot ID, QR code, navigation directions and time window.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                4
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Park & Go</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Arrive and park smoothly with zero search fatigue. Modify or cancel anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Owner Partnership CTA */}
      <section style={{ padding: '5rem 0', background: 'var(--dark-bg)', color: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#818cf8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                }}
              >
                <Building2 size={16} />
                <span>For Commercial & Private Lot Owners in India</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: '1.2', marginBottom: '1.25rem' }}>
                List Your Parking Space & Earn Daily Revenue
              </h2>
              <p style={{ color: 'var(--dark-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Join Indian parking operators using ParkEase to optimize bay utilization, eliminate manual slips, and accept digital reservations seamlessly.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/register-owner" className="btn btn-primary btn-lg">
                  <span>Register as Facility Owner</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: '#ffffff', borderColor: 'var(--dark-border)' }}>
                  Owner Login
                </Link>
              </div>
            </div>

            <div
              style={{
                background: 'var(--dark-surface)',
                border: '1px solid var(--dark-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ background: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <Zap size={22} />
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Real-Time Slot Management</h4>
                  <p style={{ color: 'var(--dark-muted)', fontSize: '0.9rem' }}>Configure hourly INR tariffs, toggle active availability, and track live occupancy.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ background: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Zero Double-Booking Engine</h4>
                  <p style={{ color: 'var(--dark-muted)', fontSize: '0.9rem' }}>Transactional backend prevents concurrent slot collisions automatically.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <CreditCard size={22} />
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Direct Revenue Insights (₹)</h4>
                  <p style={{ color: 'var(--dark-muted)', fontSize: '0.9rem' }}>Track daily earnings, active reservations and customer vehicle logs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
