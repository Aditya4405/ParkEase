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
  Cpu,
  Radio,
  Server,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  INDIAN_CITIES, 
  DESTINATION_CATEGORIES, 
  POPULAR_DESTINATIONS 
} from '../../data/indianDestinations';

const LandingPage = () => {
  const [featuredLots, setFeaturedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Lucknow');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await parkingApi.searchParkingLots({ city: 'Lucknow' });
        setFeaturedLots(res.data?.slice(0, 6) || []);
      } catch (err) {
        console.error('Failed to load featured parking lots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    navigate(`/parking-lots?${params.toString()}`);
  };

  const handleDestinationClick = (dest) => {
    const params = new URLSearchParams();
    params.set('city', dest.city);
    params.set('search', dest.name);
    if (dest.category) params.set('category', dest.category);
    navigate(`/parking-lots?${params.toString()}`);
  };

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (categoryId !== 'ALL') params.set('category', categoryId);
    navigate(`/parking-lots?${params.toString()}`);
  };

  const getCategoryIcon = (id) => {
    switch(id) {
      case 'MALL': return <ShoppingBag size={18} />;
      case 'RAILWAY_STATION': return <Train size={18} />;
      case 'HOSPITAL': return <Activity size={18} />;
      case 'COLLEGE': return <BookOpen size={18} />;
      case 'MARKET': return <Briefcase size={18} />;
      case 'AIRPORT': return <Navigation size={18} />;
      case 'TOURIST': return <MapPin size={18} />;
      default: return <Building2 size={18} />;
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* =========================================================
          HERO SECTION
          ========================================================= */}
      <section style={{ 
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', 
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 1rem 4rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Top Indian Tech Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            padding: '0.35rem 0.9rem', 
            borderRadius: '999px', 
            background: 'var(--primary-subtle)', 
            color: 'var(--primary)', 
            fontSize: '0.82rem', 
            fontWeight: 700, 
            marginBottom: '1.2rem' 
          }}>
            <Sparkles size={14} /> Smart Parking Infrastructure for India • Lucknow Hub
          </div>

          {/* Main Headline */}
          <h1 style={{ 
            fontSize: '3.1rem', 
            fontWeight: 900, 
            color: 'var(--text-main)', 
            lineHeight: '1.15', 
            letterSpacing: '-1px',
            marginBottom: '1rem' 
          }}>
            Find Parking. Reach Faster. <br />
            <span style={{ 
              background: 'linear-gradient(90deg, var(--primary) 0%, #0284c7 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Park Smarter.
            </span>
          </h1>

          {/* Supporting Subtitle */}
          <p style={{ 
            fontSize: '1.12rem', 
            color: 'var(--text-muted)', 
            lineHeight: '1.6', 
            maxWidth: '720px', 
            margin: '0 auto 2.2rem' 
          }}>
            Discover and reserve convenient parking near malls, hospitals, railway stations, colleges and popular destinations across India.
          </p>

          {/* Search Box Card */}
          <div className="card" style={{ 
            padding: '1.25rem', 
            borderRadius: '18px', 
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            textAlign: 'left'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.2fr) minmax(220px, 2.5fr) auto', gap: '0.75rem' }}>
              
              {/* City Selection */}
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', height: '52px', fontWeight: 600, fontSize: '0.95rem' }}
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} {c.hub ? '(Demo Hub)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Query */}
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search for a mall, hospital, railway station or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', height: '52px', fontSize: '0.95rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '52px', padding: '0 1.8rem', fontWeight: 700, fontSize: '1rem' }}>
                Find Parking
              </button>
            </form>

            {/* Quick Keyword Suggestions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 600 }}>Popular in Lucknow:</span>
              {['Phoenix Palassio', 'Charbagh Station', 'KGMU Trauma Centre', 'Hazratganj', 'Lulu Mall'].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    setSearchQuery(kw);
                    navigate(`/parking-lots?city=${selectedCity}&search=${encodeURIComponent(kw)}`);
                  }}
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
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Link */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem' }}>
            <Link to="/parking-lots" style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
              Explore All Parking Facilities <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          DESTINATION CATEGORIES
          ========================================================= */}
      <section style={{ padding: '3.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Browse By Category
            </span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
              Parking Near High-Density Destinations
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
              Select a destination type to view associated verified parking hubs with real-time vacancy meters.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', 
            gap: '1rem' 
          }}>
            {DESTINATION_CATEGORIES.filter(c => c.id !== 'ALL').map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="card"
                style={{
                  padding: '1.3rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '10px', 
                  background: 'var(--primary-subtle)', 
                  color: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0 
                }}>
                  {getCategoryIcon(cat.id)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                    {cat.name}
                  </h4>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {cat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          POPULAR DESTINATIONS GRID
          ========================================================= */}
      <section style={{ padding: '3.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
                Major Indian Landmarks
              </span>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
                Popular Lucknow & Transit Destinations
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                Pre-book verified multi-level and surface parking before you arrive.
              </p>
            </div>

            <Link to="/parking-lots" className="btn btn-secondary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All Locations <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', 
            gap: '1.3rem' 
          }}>
            {POPULAR_DESTINATIONS.slice(0, 6).map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleDestinationClick(dest)}
                className="card"
                style={{
                  padding: '1.4rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      padding: '0.2rem 0.55rem', 
                      borderRadius: '999px', 
                      background: 'var(--primary-subtle)', 
                      color: 'var(--primary)' 
                    }}>
                      {dest.categoryName}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      {dest.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    {dest.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    <MapPin size={14} style={{ color: 'var(--primary)' }} />
                    <span>{dest.area}, {dest.city}</span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.45', marginBottom: '1rem' }}>
                    {dest.desc}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '0.8rem', 
                  borderTop: '1px solid #f1f5f9' 
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Tariff From
                    </span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ₹{dest.startingPrice}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/hr</span>
                    </div>
                  </div>

                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    color: 'var(--primary)', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.25rem' 
                  }}>
                    Find Parking <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED LIVE PARKING HUBS
          ========================================================= */}
      <section style={{ padding: '3.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
                Real-Time Vacancy Meters
              </span>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
                Featured Parking Facilities in Lucknow
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                Live capacity tracked via simulated boom-barrier telemetry and online advance bookings.
              </p>
            </div>

            <Link to="/parking-lots?city=Lucknow" className="btn btn-secondary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Search Lucknow Hubs <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', height: '240px' }}>
                  <SkeletonLoader lines={5} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.3rem' 
            }}>
              {featuredLots.map((lot) => (
                <ParkingLotCard key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          HOW PARKEASE WORKS (4-STEP FLOW)
          ========================================================= */}
      <section style={{ padding: '4rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Seamless Experience
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
              How ParkEase Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0.3rem auto 0' }}>
              From discovering nearby facilities to automated boom-barrier clearance in four simple steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                step: '01',
                title: 'Search Destination',
                desc: 'Enter any Indian mall, railway station, hospital, or high-density area.',
                icon: <Search size={22} style={{ color: 'var(--primary)' }} />
              },
              {
                step: '02',
                title: 'Compare Live Vacancy',
                desc: 'View real-time open bays, hourly rates, vehicle compatibility, and EV chargers.',
                icon: <Radio size={22} style={{ color: '#0284c7' }} />
              },
              {
                step: '03',
                title: 'Reserve Slot & Pass',
                desc: 'Select your time window, reserve guaranteed capacity, and receive an instant QR pass.',
                icon: <CheckCircle2 size={22} style={{ color: '#059669' }} />
              },
              {
                step: '04',
                title: 'Fastag & Gate Entry',
                desc: 'Drive into the designated facility with automated sensor / Fastag gate clearance.',
                icon: <Car size={22} style={{ color: '#d97706' }} />
              }
            ].map((item) => (
              <div
                key={item.step}
                className="card"
                style={{
                  padding: '1.8rem',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: 900, 
                  color: '#e2e8f0', 
                  position: 'absolute', 
                  top: '1.2rem', 
                  right: '1.4rem' 
                }}>
                  {item.step}
                </div>
                <div style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '12px', 
                  background: 'var(--primary-subtle)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.2rem'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ENTERPRISE ARCHITECTURE: STATIC VS DYNAMIC DATA
          ========================================================= */}
      <section style={{ padding: '4rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Architecture & Data Provenance
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
              Static Data Sourcing vs. Live Dynamic Occupancy
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: '1.6', marginTop: '0.4rem' }}>
              ParkEase separates public static facility data from real-time operational availability, ensuring zero fake sensor claims and enterprise-grade accuracy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="arch-layout">
            
            {/* Static Information Column */}
            <div className="card" style={{ padding: '2rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--primary-subtle)', color: 'var(--primary)', borderRadius: '10px' }}>
                  <Database size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>1. Static Facility Data</h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Verified Infrastructure Metadata</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>OpenStreetMap & Municipal Datasets:</strong> Facility name, address, pincode, coordinates, and nearby landmarks.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Operator Registered Metadata:</strong> Total physical capacity, vehicle type slots, EV chargers, and operating hours.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Source Provenance:</strong> Each facility carries a verifiable <code>dataSource</code> and <code>externalSourceId</code>.</span>
                </li>
              </ul>
            </div>

            {/* Dynamic Real-Time Column */}
            <div className="card" style={{ padding: '2rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: '#ecfdf5', color: '#059669', borderRadius: '10px' }}>
                  <Radio size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>2. Dynamic Occupancy Telemetry</h3>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>Real-Time Availability State</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: '#334155' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Event-Driven Telemetry:</strong> Simulated ANPR cameras, loop sensors & operator boom-barriers stream <code>ENTRY</code> and <code>EXIT</code> events.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Synchronized Capacity Formula:</strong> <code>Available = Total - Occupied - Reserved</code> enforced in PostgreSQL transactions.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Operator Dashboard Control:</strong> Instant interactive entry/exit simulation to test peak-hour occupancy load.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CALL TO ACTION
          ========================================================= */}
      <section style={{ 
        padding: '4.5rem 1rem', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Ready to Experience Hassle-Free Parking in India?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Search your destination in Lucknow, Delhi NCR, or major Indian transit hubs and secure guaranteed parking in under 60 seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/parking-lots" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700 }}>
              Find Parking Near Destination
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem', fontWeight: 600, background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
              Register as Facility Operator
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .arch-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
