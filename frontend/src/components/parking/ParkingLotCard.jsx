import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Car, 
  Bike, 
  Shield, 
  Zap, 
  ArrowRight, 
  Clock, 
  Database, 
  Tag, 
  CheckCircle2,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';

const ParkingLotCard = ({ lot }) => {
  const hasCars = lot.slots?.some((s) => s.vehicleType === 'CAR' && s.active);
  const hasBikes = lot.slots?.some((s) => s.vehicleType === 'BIKE' && s.active);
  const hasSuvs = lot.slots?.some((s) => s.vehicleType === 'SUV' && s.active);
  const hasEV = lot.hasEVCharging || lot.slots?.some((s) => s.vehicleType === 'EV' && s.active);

  const totalCapacity = lot.totalCapacity || lot.totalSlots || 100;
  const occupied = lot.occupiedSlots || 0;
  const reserved = lot.reservedSlots || 0;
  
  const computedAvailable = lot.availableSlots !== undefined
    ? lot.availableSlots
    : Math.max(0, totalCapacity - occupied - reserved);

  const isFull = computedAvailable <= 0;
  const isLimited = computedAvailable > 0 && computedAvailable <= Math.max(5, Math.floor(totalCapacity * 0.15));

  const startingPrice = lot.startingPrice 
    || (lot.slots && lot.slots.length > 0 
        ? Math.min(...lot.slots.map((s) => s.price || 40)) 
        : 40);

  const categoryLabel = {
    MALL: 'Mall Parking',
    RAILWAY_STATION: 'Railway Hub',
    HOSPITAL: 'Hospital Zone',
    COLLEGE: 'Campus Bay',
    MARKET: 'Market Parking',
    AIRPORT: 'Airport Transit',
    TOURIST: 'Tourist / Religious',
  }[lot.category] || 'Public Parking';

  const sourceLabel = {
    OPENSTREETMAP: 'OSM Verified',
    OPERATOR_PORTAL: 'Operator Registered',
    MUNICIPAL_DATA: 'Municipal Data',
    ADMIN: 'Admin Verified',
  }[lot.dataSource] || 'ParkEase Verified';

  return (
    <div
      className="parking-result-card"
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '1.4rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative',
        marginBottom: '1rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Left: Info Section */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: '6px',
            background: '#e0e7ff',
            color: 'var(--primary)'
          }}>
            {categoryLabel}
          </span>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            background: '#f1f5f9',
            color: '#475569',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <CheckCircle2 size={12} color="var(--primary)" />
            <span>{sourceLabel}</span>
          </span>

          <span style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: '999px',
            background: isFull ? '#fee2e2' : isLimited ? '#fef3c7' : '#dcfce7',
            color: isFull ? '#991b1b' : isLimited ? '#92400e' : '#166534',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isFull ? '#dc2626' : isLimited ? '#d97706' : '#16a34a'
            }} />
            {isFull ? 'Full (0 bays)' : isLimited ? `${computedAvailable} Limited` : `${computedAvailable} Available`}
          </span>
        </div>

        {/* Facility Title & Destination */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.35rem', lineHeight: '1.3' }}>
          <Link to={`/parking-lots/${lot.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {lot.name}
          </Link>
        </h3>

        {/* Address */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.86rem', marginBottom: '0.65rem' }}>
          <MapPin size={14} color="var(--primary)" flexShrink={0} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lot.address}, <strong style={{ color: '#334155' }}>{lot.city}</strong> {lot.pincode ? `(${lot.pincode})` : ''}
          </span>
        </div>

        {/* Meta & Features Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#475569' }}>
          {/* Vehicle Types */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
              <Car size={13} color="var(--primary)" /> Car
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
              <Bike size={13} color="#0284c7" /> Bike
            </span>
            {hasEV && (
              <>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, color: '#16a34a' }}>
                  <Zap size={13} /> EV
                </span>
              </>
            )}
          </div>

          <span style={{ color: '#cbd5e1' }}>|</span>

          {/* Operating hours */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} color="#64748b" />
            <span>{lot.openingTime && lot.closingTime ? `${lot.openingTime} – ${lot.closingTime}` : 'Open 24x7'}</span>
          </div>

          <span style={{ color: '#cbd5e1' }}>|</span>

          {/* Parking Type */}
          <span>{lot.parkingType || 'Multi-Level'}</span>
        </div>
      </div>

      {/* Right: Pricing & Action Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingLeft: '1.5rem',
        borderLeft: '1px solid #f1f5f9',
        minWidth: '150px'
      }} className="parking-card-action-side">
        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
          Tariff Rate
        </span>
        <div style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1, margin: '0.15rem 0 0.75rem' }}>
          ₹{startingPrice}
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>/hour</span>
        </div>

        <Link
          to={`/parking-lots/${lot.id}`}
          className="btn btn-primary"
          style={{
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span>View Details</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .parking-result-card {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 1rem !important;
          }
          .parking-card-action-side {
            border-left: none !important;
            border-top: 1px solid #f1f5f9 !important;
            padding-left: 0 !important;
            padding-top: 0.85rem !important;
            flex-direction: row !important;
            justifyContent: space-between !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ParkingLotCard;
