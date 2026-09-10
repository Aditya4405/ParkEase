import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Car, 
  Bike,
  ArrowRight, 
  Building2, 
  ShoppingBag,
  Train,
  Activity,
  BookOpen,
  Briefcase,
  Navigation,
  Database,
  Radio,
  Server,
  Sparkles,
  Layers,
  CreditCard,
  QrCode,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Compass,
  Calendar
} from 'lucide-react';
import { INDIAN_CITIES } from '../../data/indianDestinations';

const LandingPage = () => {
  const [selectedCity, setSelectedCity] = useState('Lucknow');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    navigate(`/find-parking?${params.toString()}`);
  };

  const handleDestinationClick = (name, city = 'Lucknow') => {
    const params = new URLSearchParams();
    params.set('city', city);
    params.set('search', name);
    navigate(`/find-parking?${params.toString()}`);
  };

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    params.set('category', categoryId);
    navigate(`/find-parking?${params.toString()}`);
  };

  const popularDestinations = [
    {
      name: 'Phoenix Palassio',
      type: 'Mall • Lucknow',
      city: 'Lucknow',
      tag: 'Shaheed Path',
      tariff: '₹40/hr',
      ev: true,
      desc: 'North India’s premier retail & entertainment hub with multi-tier parking.',
    },
    {
      name: 'Charbagh Railway Station',
      type: 'Railway Station • Lucknow',
      city: 'Lucknow',
      tag: 'Platform 1 / Cabway',
      tariff: '₹15/hr',
      ev: true,
      desc: 'High-frequency rail transit parking with FASTag automated clearance.',
    },
    {
      name: 'KGMU Trauma Centre',
      type: 'Hospital • Lucknow',
      city: 'Lucknow',
      tag: 'Chowk / Shah Mina',
      tariff: '₹10/hr',
      ev: false,
      desc: 'Dedicated emergency & OPD access parking with 24x7 security monitoring.',
    },
    {
      name: 'University of Lucknow',
      type: 'University • Lucknow',
      city: 'Lucknow',
      tag: 'University Road',
      tariff: '₹10/hr',
      ev: false,
      desc: 'Organized campus parking for students, faculty, and visiting researchers.',
    },
    {
      name: 'Hazratganj High Street',
      type: 'Market • Lucknow',
      city: 'Lucknow',
      tag: 'MG Marg / Janpath',
      tariff: '₹20/hr',
      ev: true,
      desc: 'Automated multi-level car parking right in the shopping heart of Lucknow.',
    },
    {
      name: 'Lulu Mall',
      type: 'Mall • Lucknow',
      city: 'Lucknow',
      tag: 'Sushant Golf City',
      tariff: '₹50/hr',
      ev: true,
      desc: 'State-of-the-art automated basement & surface bay with EV fast chargers.',
    },
  ];

  const categories = [
    { id: 'MALL', name: 'Mall Parking', icon: <ShoppingBag size={20} />, desc: 'Find convenient parking near major malls and shopping complexes before you arrive.' },
    { id: 'RAILWAY_STATION', name: 'Railway Station Parking', icon: <Train size={20} />, desc: 'Park near railway platforms, cabways, and transit terminals with zero stress.' },
    { id: 'HOSPITAL', name: 'Hospital Parking', icon: <Activity size={20} />, desc: 'Quick-access parking zones near emergency OPDs, medical colleges and clinics.' },
    { id: 'COLLEGE', name: 'College & University Parking', icon: <BookOpen size={20} />, desc: 'Organized parking spaces across university campuses and educational institutes.' },
    { id: 'MARKET', name: 'Market & High Street Parking', icon: <Briefcase size={20} />, desc: 'Secure parking in bustling commercial centres, bazaars, and business districts.' },
    { id: 'AIRPORT', name: 'Airport & Transit Parking', icon: <Navigation size={20} />, desc: 'Short-term and long-term parking near airport departure and arrival gates.' },
    { id: 'MARKET', name: 'Office & Tech Park Parking', icon: <Building2 size={20} />, desc: 'Daily and hourly parking near IT hubs, corporate parks, and office towers.' },
    { id: 'TOURIST', name: 'Tourist & Religious Parking', icon: <MapPin size={20} />, desc: 'Dedicated parking near heritage monuments, pilgrimage sites, and tourist hubs.' },
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* =========================================================
          1. HERO SECTION
          ========================================================= */}
      <section style={{ 
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', 
        borderBottom: '1px solid var(--border)',
        padding: '4rem 1rem 3.5rem',
      }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.15fr 0.85fr', 
            gap: '3rem', 
            alignItems: 'center' 
          }} className="hero-grid">
            
            {/* Left Column: Heading & Value Proposition */}
            <div>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                padding: '0.35rem 0.85rem', 
                borderRadius: '999px', 
                background: 'var(--primary-subtle)', 
                color: 'var(--primary)', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                marginBottom: '1.25rem' 
              }}>
                <Sparkles size={14} /> Smart Parking Infrastructure for India
              </div>

              <h1 style={{ 
                fontSize: '3.2rem', 
                fontWeight: 900, 
                color: '#0f172a', 
                lineHeight: '1.15', 
                letterSpacing: '-1.5px',
                marginBottom: '1.25rem' 
              }}>
                Find Parking.<br />
                Reach Faster.<br />
                <span style={{ 
                  background: 'linear-gradient(90deg, var(--primary) 0%, #0284c7 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>
                  Park Smarter.
                </span>
              </h1>

              <p style={{ 
                fontSize: '1.12rem', 
                color: '#475569', 
                lineHeight: '1.65', 
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                Discover and reserve convenient parking near malls, hospitals, railway stations, colleges and popular destinations across India.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link 
                  to="/find-parking" 
                  className="btn btn-primary" 
                  style={{ 
                    padding: '0.85rem 1.8rem', 
                    fontSize: '1rem', 
                    fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)' 
                  }}
                >
                  Find Parking <ArrowRight size={16} />
                </Link>

                <a 
                  href="#how-it-works" 
                  className="btn btn-secondary" 
                  style={{ padding: '0.85rem 1.6rem', fontSize: '1rem', fontWeight: 600 }}
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Right Column: Modern Indian Mobility Visual Card (NO MAP) */}
            <div>
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '1.8rem',
                boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
                position: 'relative'
              }}>
                
                {/* Floating Verified Badge */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.2rem',
                  paddingBottom: '0.9rem',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      Live Facility Reservation Preview
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#64748b' }}>
                    Lucknow Hub
                  </span>
                </div>

                {/* Sample Card */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.2rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        🛍️ Shopping Mall Bay
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                        Phoenix Palassio Multi-Level
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                        <MapPin size={13} style={{ color: 'var(--primary)' }} />
                        <span>Shaheed Path, Gomti Nagar Ext, Lucknow</span>
                      </div>
                    </div>
                    <span className="status-pill available" style={{ fontSize: '0.75rem' }}>
                      🟢 63 Open Bays
                    </span>
                  </div>

                  {/* Telemetry Meter */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '0.5rem', 
                    marginTop: '0.9rem',
                    background: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Capacity</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>150</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#be123c', fontWeight: 600 }}>Occupied</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#e11d48' }}>82</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 600 }}>Available</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>63</div>
                    </div>
                  </div>
                </div>

                {/* Mini Reservation Pass Simulation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  background: '#ecfdf5',
                  borderRadius: '12px',
                  border: '1px solid #a7f3d0',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <QrCode size={20} style={{ color: '#059669' }} />
                    <div>
                      <strong style={{ color: '#065f46', display: 'block' }}>Guaranteed QR Gate Pass</strong>
                      <span style={{ color: '#047857', fontSize: '0.74rem' }}>Fastag & Boom Barrier Ready</span>
                    </div>
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: '#047857' }}>₹40/hr</strong>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              2. SIMPLIFIED HERO SEARCH COMPONENT
              ========================================================= */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            marginTop: '2.5rem'
          }}>
            <form onSubmit={handleSearchSubmit} style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 1.2fr) minmax(250px, 3fr) auto',
              gap: '0.75rem'
            }} className="hero-search-form">
              
              {/* City Selection */}
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', height: '50px', fontWeight: 600, fontSize: '0.92rem' }}
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} {c.hub ? '(Demo Hub)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Input */}
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search for a mall, hospital, railway station or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', height: '50px', fontSize: '0.92rem' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ height: '50px', padding: '0 1.8rem', fontWeight: 700, fontSize: '0.95rem' }}
              >
                Find Parking →
              </button>
            </form>

            {/* Popular Searches */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginTop: '0.9rem', 
              flexWrap: 'wrap', 
              fontSize: '0.82rem', 
              color: '#64748b' 
            }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>Popular searches:</span>
              {['Phoenix Palassio', 'Charbagh Railway Station', 'KGMU', 'Hazratganj', 'Lulu Mall'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleDestinationClick(item, 'Lucknow')}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '999px',
                    padding: '0.2rem 0.65rem',
                    fontSize: '0.78rem',
                    color: '#334155',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. TRUST / PLATFORM STATISTICS SECTION
          ========================================================= */}
      <section style={{ padding: '2.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>1,000+</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>Designated Bays</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Platform capacity for demonstration</div>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0284c7' }}>11+</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>Prime Transit Hubs</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Malls, railway stations & hospitals</div>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>100%</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>Verified Facilities</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>OpenStreetMap & operator backed</div>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#d97706' }}>Safe & Secure</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>Instant QR Booking</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Zero double-booking guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. POPULAR DESTINATIONS
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
                Major Indian Landmarks
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
                Popular Destinations
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.98rem', marginTop: '0.2rem' }}>
                Find parking near the places you visit most.
              </p>
            </div>

            <Link to="/find-parking" className="btn btn-secondary" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              View All Facilities <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.4rem'
          }}>
            {popularDestinations.map((dest) => (
              <div
                key={dest.name}
                onClick={() => handleDestinationClick(dest.name, dest.city)}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.03)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '999px', 
                      background: 'var(--primary-subtle)', 
                      color: 'var(--primary)' 
                    }}>
                      {dest.type}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      {dest.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {dest.name}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.2rem' }}>
                    {dest.desc}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '0.9rem', 
                  borderTop: '1px solid #f1f5f9' 
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                      Tariff From
                    </span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {dest.tariff}
                    </div>
                  </div>

                  <span style={{ 
                    fontSize: '0.84rem', 
                    fontWeight: 700, 
                    color: 'var(--primary)', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.25rem' 
                  }}>
                    Find Parking <ChevronRight size={15} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. PARKING FOR EVERY DESTINATION (CATEGORIES)
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Explore Facilities
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
              Parking for Every Destination
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '620px', margin: '0.3rem auto 0' }}>
              Tailored parking solutions designed for Indian urban mobility and high-density zones.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.id)}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    {cat.icon}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {cat.name}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {cat.desc}
                  </p>
                </div>

                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  View Parking →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          6. HOW IT WORKS (4 STEPS)
          ========================================================= */}
      <section id="how-it-works" style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Effortless Booking Flow
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
              How It Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '600px', margin: '0.3rem auto 0' }}>
              Four simple steps to guaranteed parking across Indian destinations.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                step: '01',
                title: 'Search Your Destination',
                desc: 'Search for a mall, hospital, railway station, college or area across Lucknow and Indian cities.',
                icon: <Search size={22} style={{ color: 'var(--primary)' }} />
              },
              {
                step: '02',
                title: 'Compare Parking',
                desc: 'View nearby parking options, transparent hourly tariffs, vehicle type compatibility, and availability.',
                icon: <Layers size={22} style={{ color: '#0284c7' }} />
              },
              {
                step: '03',
                title: 'Reserve Your Spot',
                desc: 'Choose your vehicle, select your arrival time window, and secure your guaranteed parking pass.',
                icon: <CheckCircle2 size={22} style={{ color: '#059669' }} />
              },
              {
                step: '04',
                title: 'Park & Go',
                desc: 'Reach your destination with less time wasted driving around searching for parking.',
                icon: <Car size={22} style={{ color: '#d97706' }} />
              }
            ].map((item) => (
              <div
                key={item.step}
                className="card"
                style={{
                  padding: '2rem 1.6rem',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: 900, 
                  color: '#e2e8f0', 
                  position: 'absolute', 
                  top: '1.2rem', 
                  right: '1.4rem' 
                }}>
                  {item.step}
                </div>

                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--primary-subtle)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.4rem'
                }}>
                  {item.icon}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.45rem' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.55' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          7. WHY CHOOSE PARKEASE
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Core Benefits
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
              Why Choose ParkEase?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '600px', margin: '0.3rem auto 0' }}>
              Parking should be simple, convenient and reliable.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <MapPin size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Convenient Locations
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.55' }}>
                Find parking near the places you are visiting — right near mall gates, hospital trauma entries, and railway platforms.
              </p>
            </div>

            <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Save Time
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.55' }}>
                Reserve parking before reaching your destination, eliminating circular driving and traffic bottlenecks.
              </p>
            </div>

            <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Verified Facilities
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.55' }}>
                Get structured parking information sourced from OpenStreetMap and verified operator-managed facilities.
              </p>
            </div>

            <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <CreditCard size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Transparent Pricing
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.55' }}>
                See exact hourly parking charges in ₹ (INR) before making a reservation with no hidden surcharges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. KNOW BEFORE YOU PARK / AVAILABILITY EXPLANATION
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
            Operational Transparency
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
            Know Before You Park
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '680px', margin: '0.4rem auto 2.5rem', lineHeight: '1.6' }}>
            ParkEase keeps parking availability connected to the parking facility’s operational data and advance reservations.
          </p>

          {/* Flow Diagram Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}><Building2 size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>1. Parking Facility</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Designated capacity</span>
            </div>

            <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#0284c7', marginBottom: '0.4rem' }}><Radio size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>2. Occupancy Updates</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Entry & exit events</span>
            </div>

            <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#059669', marginBottom: '0.4rem' }}><Server size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>3. ParkEase Backend</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>State synchronization</span>
            </div>

            <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#d97706', marginBottom: '0.4rem' }}><UserCheck size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>4. Live User Vacancy</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Bookable open bays</span>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#64748b', fontStyle: 'italic' }}>
            "Availability is updated from parking operations, boom-barrier telemetry events, and active reservations."
          </p>
        </div>
      </section>

      {/* =========================================================
          9. SERVICES SECTION
          ========================================================= */}
      <section id="services" style={{ padding: '4.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Platform Capabilities
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
              Everything You Need for Smarter Parking
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '620px', margin: '0.3rem auto 0' }}>
              Comprehensive digital tools for commuters, vehicle owners, and commercial parking facility operators.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { title: 'Parking Discovery', desc: 'Find verified parking facilities near your target destination with vehicle compatibility checks.', icon: <Compass size={22} style={{ color: 'var(--primary)' }} /> },
              { title: 'Advance Reservation', desc: 'Reserve your parking slot before arrival and receive an instant digital reservation pass.', icon: <Calendar size={22} style={{ color: '#0284c7' }} /> },
              { title: 'Availability Tracking', desc: 'View current parking availability maintained accurately by parking operations and telemetry.', icon: <Radio size={22} style={{ color: '#059669' }} /> },
              { title: 'Digital Booking', desc: 'Manage your active reservations, view past parking history, and cancel anytime with full transparency.', icon: <QrCode size={22} style={{ color: '#d97706' }} /> },
              { title: 'Parking Management', desc: 'Parking owners can manage lots, slot capacities, hourly pricing, and record entry/exit telemetry.', icon: <Building2 size={22} style={{ color: '#7c3aed' }} /> },
              { title: 'Admin Management', desc: 'System administrators can manage platform users, operators, facility databases, and ecosystem audits.', icon: <ShieldCheck size={22} style={{ color: '#be123c' }} /> },
            ].map((svc) => (
              <div
                key={svc.title}
                className="card"
                style={{
                  padding: '1.8rem',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  gap: '1.2rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '12px', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {svc.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.55' }}>
                    {svc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          10. USER BENEFITS: STOP SEARCHING FOR PARKING
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
            The Better Way
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
            Stop Searching for Parking
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '620px', margin: '0.4rem auto 2.5rem', lineHeight: '1.6' }}>
            Instead of circling around crowded roads and high-density commercial markets:
          </p>

          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {['Search Destination', 'Compare Nearby', 'Check Availability', 'Reserve Slot', 'Arrive', 'Park & Go'].map((step, idx) => (
              <React.Fragment key={step}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>
                    {idx + 1}
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block' }}>{step}</strong>
                </div>
                {idx < 5 && (
                  <div style={{ color: '#cbd5e1', fontWeight: 900, fontSize: '1.1rem' }} className="step-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          11. PARKING OPERATOR / OWNER SECTION
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            borderRadius: '24px',
            padding: '3.5rem 2.5rem',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'center'
          }} className="owner-grid">
            
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '1px' }}>
                For Parking Facility Owners
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '0.4rem', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
                Manage Your Parking Facility with ParkEase
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: '1.65', marginBottom: '2rem' }}>
                Give your customers an easier way to discover and reserve your parking facility. Streamline operations with real-time occupancy telemetry.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  'Manage parking lots & layouts',
                  'Manage bay pricing by vehicle',
                  'Track physical & reserved capacity',
                  'Simulate gate entry/exit activity',
                  'Audit real-time booking revenue',
                  'Zero hardware lock-in'
                ].map((feat) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <Link 
                to="/register-owner" 
                className="btn btn-primary" 
                style={{ 
                  padding: '0.85rem 1.8rem', 
                  fontSize: '0.95rem', 
                  fontWeight: 700,
                  background: '#38bdf8',
                  color: '#0f172a',
                  border: 'none'
                }}
              >
                Register as Parking Owner →
              </Link>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '1.8rem',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Operator Dashboard Controls
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                Live Occupancy Simulation
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '1.2rem' }}>
                Test and demonstrate boom-barrier vehicle ENTRY & EXIT events with instant capacity recalculation.
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  <span>Phoenix Palassio Bay</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>63 Open / 150 Total</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                  <div style={{ flex: 1, padding: '0.4rem', background: '#059669', borderRadius: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    + Vehicle Entry
                  </div>
                  <div style={{ flex: 1, padding: '0.4rem', background: '#be123c', borderRadius: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    - Vehicle Exit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          12. ABOUT SECTION
          ========================================================= */}
      <section id="about" style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
            Our Mission
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', marginBottom: '1.2rem', letterSpacing: '-0.5px' }}>
            About ParkEase
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.75', marginBottom: '2rem' }}>
            ParkEase is a smart parking management and reservation platform designed for the Indian parking ecosystem. It connects users looking for convenient parking with parking facilities that need better digital management.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                📍 Destination-Based
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Search by actual Indian malls, railway stations & hospitals.
              </span>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                🎟️ Advance Reservation
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Secure your slot in advance and skip circling on arrival.
              </span>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
                📊 Operational Telemetry
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Availability kept synchronized with real gate operations.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          13. FINAL CALL TO ACTION
          ========================================================= */}
      <section id="contact" style={{ 
        padding: '5rem 1rem', 
        background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)', 
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Ready to Park Smarter?
          </h2>
          <p style={{ color: '#e0e7ff', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.2rem' }}>
            Find convenient parking near your destination and spend less time searching.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              to="/find-parking" 
              className="btn btn-secondary" 
              style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', fontWeight: 800, background: '#ffffff', color: 'var(--primary)', border: 'none' }}
            >
              Find Parking Near Destination
            </Link>
            <Link 
              to="/register" 
              className="btn btn-secondary" 
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Responsive Style Overrides */}
      <style>{`
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .hero-search-form {
            grid-template-columns: 1fr !important;
          }
          .owner-grid {
            grid-template-columns: 1fr !important;
            padding: 2rem 1.5rem !important;
          }
          .step-arrow {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
