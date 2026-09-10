import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Car, 
  ArrowRight, 
  Building2, 
  ShoppingBag,
  Train,
  Activity,
  BookOpen,
  Briefcase,
  Radio,
  Server,
  Sparkles,
  Layers,
  CreditCard,
  QrCode,
  Plane,
  Compass,
  Calendar,
  Users,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCategoryExplore = (categoryId) => {
    navigate(`/find-parking?category=${encodeURIComponent(categoryId)}`);
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* =========================================================
          1. HERO SECTION (Clean SaaS, No Search Box, No Map)
          ========================================================= */}
      <section style={{
        padding: '5rem 1rem 4.5rem',
        background: 'radial-gradient(ellipse at 50% -20%, #e0e7ff 0%, #f8fafc 65%, #ffffff 100%)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '3.5rem',
            alignItems: 'center'
          }} className="hero-grid">
            
            {/* Left Column: Value Proposition */}
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
                marginBottom: '1.25rem',
                border: '1px solid rgba(79, 70, 229, 0.2)'
              }}>
                <Sparkles size={14} />
                <span>Smart Parking for Smarter Journeys</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.6rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                color: '#0f172a',
                marginBottom: '1.25rem'
              }}>
                Find Parking.<br />
                Reach Faster.<br />
                <span style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Park Smarter.
                </span>
              </h1>

              <p style={{
                fontSize: '1.12rem',
                lineHeight: '1.65',
                color: '#475569',
                marginBottom: '2.25rem',
                maxWidth: '540px'
              }}>
                Discover convenient parking, check availability and reserve your spot before you arrive. Spend less time circling and more time where it matters.
              </p>

              {/* Call-to-Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/find-parking"
                  className="btn btn-primary"
                  style={{
                    padding: '0.9rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
                    borderRadius: '10px'
                  }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.9rem 1.8rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    background: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  How It Works
                </button>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#64748b', fontSize: '0.84rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={15} style={{ color: '#059669' }} /> Instant Digital Pass
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={15} style={{ color: '#059669' }} /> Free Cancellations
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={15} style={{ color: '#059669' }} /> 100% Guaranteed Space
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual (Clean Facility / Availability Showcase, No Map) */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '2rem',
                boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.03)',
                position: 'relative',
                zIndex: 2
              }}>
                {/* Visual Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.8px' }}>
                      Prime Facility Pass
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0' }}>
                      Central Transit & Mall Hub
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                      Multi-Level Covered Parking
                    </p>
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    Available
                  </span>
                </div>

                {/* Capacity Gauge Metric */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.6rem' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Real-Time Bay Capacity</span>
                    <strong style={{ color: 'var(--primary)', fontWeight: 800 }}>68 Bays Open</strong>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #4f46e5 0%, #0284c7 100%)', borderRadius: '999px' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                    <span>150 Total Spaces</span>
                    <span>77 Occupied</span>
                    <span>5 Reserved</span>
                  </div>
                </div>

                {/* Feature Tags */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.6rem', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Rate</span>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>₹40/hr</strong>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.6rem', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>EV Fast Charging</span>
                    <strong style={{ fontSize: '0.9rem', color: '#059669' }}>Available</strong>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.6rem', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Hours</span>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>24 / 7 Open</strong>
                  </div>
                </div>

                {/* Reservation Action Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                  borderRadius: '12px',
                  padding: '0.9rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.4rem', borderRadius: '8px' }}>
                      <QrCode size={18} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>Digital QR Gate Entry</strong>
                      <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Scan & park seamlessly</span>
                    </div>
                  </div>
                  <Link 
                    to="/find-parking" 
                    style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <span>Reserve</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Decorative Subtle Background Layer */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                bottom: '-15px',
                left: '-15px',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
                borderRadius: '28px',
                zIndex: 1
              }}></div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          2. PLATFORM STATISTICS / TRUST SECTION
          ========================================================= */}
      <section style={{ padding: '3.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-1px' }}>
                10,000+
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>
                Parking Spaces
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                Managed across partner facilities
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0284c7', letterSpacing: '-1px' }}>
                500+
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>
                Parking Locations
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                Malls, stations, transit & hubs
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#059669', letterSpacing: '-1px' }}>
                50,000+
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>
                Happy Users
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                Commuters booking effortlessly
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#d97706', letterSpacing: '-1px' }}>
                Safe & Secure
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>
                Trusted Platform
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                Structured booking & verification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. POPULAR DESTINATION TYPES (Introduction Only, No Search/Filter Grid)
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Destinations Covered
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
              Popular Destination Types
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '580px', margin: '0.3rem auto 0' }}>
              Explore parking options around places people visit every day.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            {[
              { id: 'MALL', title: 'Shopping Malls', desc: 'Secure parking near premier retail complexes and entertainment hubs.', icon: <ShoppingBag size={24} style={{ color: '#4f46e5' }} /> },
              { id: 'RAILWAY_STATION', title: 'Railway Stations', desc: 'Fast, convenient parking near central train and transit junctions.', icon: <Train size={24} style={{ color: '#0284c7' }} /> },
              { id: 'HOSPITAL', title: 'Hospitals & Medical Centers', desc: 'Priority parking near medical colleges, trauma centers and hospitals.', icon: <Activity size={24} style={{ color: '#059669' }} /> },
              { id: 'COLLEGE', title: 'Universities & Colleges', desc: 'Student and faculty parking solutions near major academic campuses.', icon: <BookOpen size={24} style={{ color: '#d97706' }} /> },
              { id: 'MARKET', title: 'Business & Tech Parks', desc: 'Convenient daily and hourly parking in high-density office zones.', icon: <Briefcase size={24} style={{ color: '#7c3aed' }} /> },
              { id: 'AIRPORT', title: 'Airports & Transit Hubs', desc: 'Long-term and short-term secure parking for domestic and global travel.', icon: <Plane size={24} style={{ color: '#0284c7' }} /> },
              { id: 'TOURIST', title: 'Tourist & Cultural Sites', desc: 'Organized parking near heritage monuments, temples and tourist centers.', icon: <Building2 size={24} style={{ color: '#be123c' }} /> },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryExplore(cat.id)}
                className="card"
                style={{
                  padding: '1.6rem',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    {cat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {cat.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5' }}>
                    {cat.desc}
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary)' }}>
                  <span>Explore Parking</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          4. WHY CHOOSE PARKEASE
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              The ParkEase Advantage
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
              Why Choose ParkEase?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '580px', margin: '0.3rem auto 0' }}>
              Parking should be simple, convenient and reliable.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ padding: '1.8rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e0e7ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Convenient
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Find parking near the places you need to go without guesswork or delays.
              </p>
            </div>

            <div style={{ padding: '1.8rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Clock size={22} />
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Save Time
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Spend less time searching for an available space and reach your destinations faster.
              </p>
            </div>

            <div style={{ padding: '1.8rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Calendar size={22} />
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Easy Reservation
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Reserve your parking before you arrive and receive an instant digital entry pass.
              </p>
            </div>

            <div style={{ padding: '1.8rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Transparent
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Know the parking details, vehicle clearances, and exact tariffs before you book.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          5. HOW IT WORKS (4 Step Process)
          ========================================================= */}
      <section id="how-it-works" style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Simple Journey
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
              How It Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '560px', margin: '0.3rem auto 0' }}>
              Four simple steps to guaranteed parking.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Discover
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Find parking near your destination with complete facility information.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0284c7', color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Compare
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Compare available parking facilities, pricing and vehicle options.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#059669', color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Reserve
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Select your time and reserve your parking spot in advance.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#d97706', color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                04
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Park
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                Arrive, scan your digital pass, park and continue your journey smoothly.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          6. SERVICES SECTION
          ========================================================= */}
      <section id="services" style={{ padding: '4.5rem 1rem', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Platform Services
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
              { title: 'Parking Discovery', desc: 'Discover convenient parking facilities near your target destination.', icon: <Compass size={22} style={{ color: 'var(--primary)' }} /> },
              { title: 'Availability', desc: 'View parking availability maintained by parking operations.', icon: <Radio size={22} style={{ color: '#0284c7' }} /> },
              { title: 'Reservation', desc: 'Reserve a parking space in advance with guaranteed bay confirmation.', icon: <Calendar size={22} style={{ color: '#059669' }} /> },
              { title: 'Digital Bookings', desc: 'Manage all your bookings, active passes, and history from one place.', icon: <QrCode size={22} style={{ color: '#d97706' }} /> },
              { title: 'Parking Management', desc: 'Owners can manage parking facilities, slots, hourly pricing and occupancy.', icon: <Building2 size={22} style={{ color: '#7c3aed' }} /> },
              { title: 'Operations', desc: 'Parking operators can manage entry/exit activity and real-time availability.', icon: <ShieldCheck size={22} style={{ color: '#be123c' }} /> },
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
          7. REAL-TIME AVAILABILITY EXPLANATION
          ========================================================= */}
      <section style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
            Operational Accuracy
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', letterSpacing: '-0.5px' }}>
            Know Before You Park
          </h2>
          <p style={{ color: '#475569', fontSize: '1.02rem', maxWidth: '680px', margin: '0.4rem auto 2.5rem', lineHeight: '1.6' }}>
            ParkEase connects parking information, reservations and occupancy updates so users can make better parking decisions.
          </p>

          {/* Flow Diagram */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}><Building2 size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>Parking Facility</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Physical parking location</span>
            </div>

            <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#0284c7', marginBottom: '0.4rem' }}><Radio size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>Occupancy Updates</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Operator & gate events</span>
            </div>

            <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#059669', marginBottom: '0.4rem' }}><Server size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>ParkEase</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Dynamic sync engine</span>
            </div>

            <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#d97706', marginBottom: '0.4rem' }}><UserCheck size={24} style={{ margin: '0 auto' }} /></div>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>Current Availability</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Bookable open spaces</span>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#64748b', fontStyle: 'italic' }}>
            "Availability is maintained accurately through parking operations, gate events, and active reservations."
          </p>
        </div>
      </section>

      {/* =========================================================
          8. PARKING OPERATOR / PARTNER SECTION
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
                For Parking Facility Partners
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginTop: '0.4rem', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
                Manage Your Parking Facility with ParkEase
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: '1.65', marginBottom: '2rem' }}>
                Manage your parking spaces, reservations and occupancy from one place. Give your customers a seamless digital booking experience.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  'Parking management',
                  'Slot management',
                  'Booking management',
                  'Occupancy management',
                  'Availability updates',
                  'Operational insights'
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
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                Become a Parking Partner →
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
                Operator Dashboard
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                Real-Time Facility Operations
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '1.2rem' }}>
                Simulate and manage barrier entry/exit activity with automated capacity recalculation.
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  <span>Main Terminal Bay</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>68 Open / 150 Total</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                  <div style={{ flex: 1, padding: '0.45rem', background: '#059669', borderRadius: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    + Vehicle Entry
                  </div>
                  <div style={{ flex: 1, padding: '0.45rem', background: '#be123c', borderRadius: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    - Vehicle Exit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          9. ABOUT SECTION
          ========================================================= */}
      <section id="about" style={{ padding: '4.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
            Our Mission
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem', marginBottom: '1.2rem', letterSpacing: '-0.5px' }}>
            About ParkEase
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.75', marginBottom: '2.5rem' }}>
            ParkEase is a smart parking management and reservation platform designed to streamline urban mobility. It connects drivers looking for convenient parking with facilities that need modern digital operations and management.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                🎯 Destination-Based
              </strong>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Find verified parking directly around malls, stations, and key locations.
              </span>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                🎟️ Advance Reservation
              </strong>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Secure your parking spot before starting your journey.
              </span>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                📊 Operational Telemetry
              </strong>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Real-time tracking synchronized with physical parking operations.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          10. FINAL CALL TO ACTION
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
            Create your account and make parking simpler.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              to="/find-parking" 
              className="btn btn-secondary" 
              style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', fontWeight: 800, background: '#ffffff', color: 'var(--primary)', border: 'none', borderRadius: '10px' }}
            >
              Get Started
            </Link>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="btn btn-secondary" 
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', cursor: 'pointer' }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Responsive Style Overrides */}
      <style>{`
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .owner-grid {
            grid-template-columns: 1fr !important;
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
