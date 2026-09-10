import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Car, Eye, Compass, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapVisualizer = ({ parkingLots = [], selectedLot, onSelectLot, city = 'Lucknow' }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Map coordinates simulation for visual positioning
  const getCoordinates = (lot, index) => {
    // Determine offset based on name / index to provide clean distribution
    const positions = [
      { x: 38, y: 35, area: 'Gomti Nagar' },
      { x: 62, y: 48, area: 'Shaheed Path / Palassio' },
      { x: 28, y: 65, area: 'Charbagh Station' },
      { x: 45, y: 72, area: 'Hazratganj MG Marg' },
      { x: 20, y: 40, area: 'Chowk / KGMU' },
      { x: 75, y: 60, area: 'Lulu Mall Golf City' },
      { x: 50, y: 25, area: 'Indira Nagar' },
      { x: 70, y: 30, area: 'Noida Hub' },
    ];
    const pos = positions[index % positions.length];
    return pos;
  };

  return (
    <div className="map-canvas-container" style={{ height: '100%', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
      {/* Map Header Bar */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.35rem', borderRadius: '6px', color: 'var(--primary)' }}>
            <Compass size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Interactive Parking Radar
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {city} Region • {parkingLots.length} Smart Hubs Active
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
            <span className="status-indicator-dot" style={{ width: '6px', height: '6px', background: '#10b981' }}></span>
            Live Telemetry
          </span>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.4))}
              style={{ padding: '0.25rem 0.6rem', background: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              style={{ padding: '0.25rem 0.6rem', background: '#fff', fontSize: '0.9rem', fontWeight: 'bold', borderLeft: '1px solid var(--border)' }}
              title="Zoom Out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Map View Canvas */}
      <div
        className="map-grid-roads"
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'grab',
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      >
        {/* Simulated Metro & River Corridors */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {/* Gomti River Path */}
          <path
            d="M 0 160 Q 200 240, 450 180 T 900 260"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 0 160 Q 200 240, 450 180 T 900 260"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Shaheed Path Expressway */}
          <path
            d="M 120 0 Q 300 350, 780 480"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
          />
          <path
            d="M 120 0 Q 300 350, 780 480"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="8 6"
          />

          {/* Metro Blue Corridor */}
          <path
            d="M 180 500 L 400 320 L 720 180"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </svg>

        {/* Sector Labels */}
        <div style={{ position: 'absolute', top: '12%', left: '8%', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Lucknow North / Chowk
        </div>
        <div style={{ position: 'absolute', top: '22%', right: '14%', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Gomti River Bank
        </div>
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Charbagh Transit Zone
        </div>
        <div style={{ position: 'absolute', bottom: '12%', right: '18%', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Shaheed Path / Golf City
        </div>

        {/* Parking Lot Markers */}
        {parkingLots.map((lot, idx) => {
          const coords = getCoordinates(lot, idx);
          const isSelected = selectedLot && selectedLot.id === lot.id;
          const availableCount = lot.slots ? lot.slots.filter((s) => s.isAvailable && s.active).length : (lot.totalSlots || 24);
          const totalCount = lot.slots ? lot.slots.length : (lot.totalSlots || 30);
          const isFull = availableCount === 0;
          const isLimited = availableCount > 0 && availableCount < 10;

          return (
            <div
              key={lot.id || idx}
              onClick={() => onSelectLot && onSelectLot(lot)}
              style={{
                position: 'absolute',
                top: `${coords.y}%`,
                left: `${coords.x}%`,
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                zIndex: isSelected ? 40 : 20,
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Marker Bubble */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '20px',
                  background: isSelected ? 'var(--dark-bg)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: isSelected ? '2px solid var(--primary)' : '2px solid #ffffff',
                  boxShadow: isSelected
                    ? '0 10px 25px -4px rgba(79, 70, 229, 0.4), 0 0 0 4px rgba(79, 70, 229, 0.2)'
                    : '0 4px 14px rgba(0, 0, 0, 0.12)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isFull ? '#ef4444' : isLimited ? '#f59e0b' : '#10b981',
                  }}
                />
                <span>₹{lot.slots && lot.slots[0] ? lot.slots[0].price : 40}/hr</span>
                <span style={{ color: isSelected ? '#93c5fd' : 'var(--text-muted)', fontSize: '0.7rem' }}>
                  ({availableCount} free)
                </span>
              </div>

              {/* Marker Pointer Pin */}
              <div
                style={{
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `8px solid ${isSelected ? 'var(--dark-bg)' : '#ffffff'}`,
                  margin: '0 auto',
                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Selected Lot Quick Overlay Card */}
      {selectedLot && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            zIndex: 30,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedLot.name}
              </h4>
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                Verified Bay
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedLot.address}, {selectedLot.city}
              </span>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Link to={`/parking-lots/${selectedLot.id}`} className="btn btn-primary btn-sm">
              <Eye size={14} />
              View Details & Book
            </Link>
          </div>
        </div>
      )}

      {/* Map Disclaimer Footer */}
      <div
        style={{
          background: '#f8fafc',
          padding: '0.4rem 1rem',
          fontSize: '0.7rem',
          color: 'var(--text-subtle)',
          textAlign: 'center',
          borderTop: '1px solid var(--border)',
        }}
      >
        ParkEase Simulation Radar • Coordinates optimized for destination parking in {city}
      </div>
    </div>
  );
};

export default MapVisualizer;
