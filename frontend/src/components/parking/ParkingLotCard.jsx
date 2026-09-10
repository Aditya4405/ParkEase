import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Car, Bike, Shield, Zap, ArrowRight, Clock, Database, Tag, CheckCircle } from 'lucide-react';

const ParkingLotCard = ({ lot, onSelect = null }) => {
  const hasCars = lot.slots?.some((s) => s.vehicleType === 'CAR' && s.active);
  const hasBikes = lot.slots?.some((s) => s.vehicleType === 'BIKE' && s.active);
  const hasSuvs = lot.slots?.some((s) => s.vehicleType === 'SUV' && s.active);
  const hasEV = lot.hasEVCharging || lot.slots?.some((s) => s.vehicleType === 'EV' && s.active);

  const totalCapacity = lot.totalCapacity || lot.totalSlots || (lot.slots ? lot.slots.length : 100);
  const occupied = lot.occupiedSlots || 0;
  const reserved = lot.reservedSlots || 0;
  
  const computedAvailable = lot.availableSlots !== undefined
    ? lot.availableSlots
    : Math.max(0, totalCapacity - occupied - reserved);

  const isFull = computedAvailable === 0;
  const isLimited = computedAvailable > 0 && computedAvailable <= Math.max(5, Math.floor(totalCapacity * 0.15));

  const startingPrice = lot.startingPrice 
    || (lot.slots && lot.slots.length > 0 
        ? Math.min(...lot.slots.map((s) => s.price || 40)) 
        : 30);

  const categoryLabel = {
    MALL: '🛍️ Mall Parking',
    RAILWAY_STATION: '🚆 Railway Hub',
    HOSPITAL: '🏥 Hospital Zone',
    COLLEGE: '🎓 Campus Bay',
    MARKET: '🛒 Market Stack',
    AIRPORT: '✈️ Transit Hub',
    TOURIST: '🛕 Pilgrim/Tourist',
  }[lot.category] || '📍 Public Parking';

  const sourceLabel = {
    OPENSTREETMAP: 'OSM Verified',
    OPERATOR_PORTAL: 'Operator Registered',
    MUNICIPAL_DATA: 'Municipal Data',
    ADMIN: 'Admin Verified',
  }[lot.dataSource] || 'ParkEase Verified';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderRadius: '16px',
        padding: '1.4rem',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Top Header Tags */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            padding: '0.2rem 0.6rem', 
            borderRadius: '999px', 
            background: 'var(--primary-subtle)', 
            color: 'var(--primary)' 
          }}>
            {categoryLabel}
          </span>
          <span style={{ 
            fontSize: '0.72rem', 
            fontWeight: 600, 
            padding: '0.2rem 0.55rem', 
            borderRadius: '999px', 
            background: '#f1f5f9', 
            color: '#475569',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Database size={11} /> {sourceLabel}
          </span>
        </div>

        {/* Live Status Pill */}
        <span
          className={`status-pill ${isFull ? 'full' : isLimited ? 'limited' : 'available'}`}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
        >
          <span className="dot" />
          {isFull ? '🔴 Full (0 slots)' : isLimited ? `🟡 Limited (${computedAvailable} left)` : `🟢 ${computedAvailable} Available`}
        </span>
      </div>

      {/* Facility Name & Destination */}
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.35', marginBottom: '0.35rem' }}>
          <Link to={`/parking-lots/${lot.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {lot.name}
          </Link>
        </h3>
        
        {lot.nearbyDestination && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.84rem', color: '#0369a1', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Tag size={13} />
            <span>Serving: {lot.nearbyDestination}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{lot.address}, {lot.city} {lot.pincode ? `(${lot.pincode})` : ''}</span>
        </div>
      </div>

      {/* Real-Time Operational Capacity Telemetry */}
      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '10px', 
        padding: '0.65rem 0.85rem', 
        marginBottom: '0.85rem',
        fontSize: '0.78rem',
        color: '#334155'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontWeight: 600 }}>Capacity Breakdown</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            {lot.parkingType || 'Covered Stack'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontWeight: 600 }}>
          <span>Total: <strong style={{ color: '#0f172a' }}>{totalCapacity}</strong></span>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span>Occupied: <strong style={{ color: '#e11d48' }}>{occupied}</strong></span>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span>Reserved: <strong style={{ color: '#d97706' }}>{reserved}</strong></span>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span>Open: <strong style={{ color: '#059669' }}>{computedAvailable}</strong></span>
        </div>
      </div>

      {/* Vehicle Types & Operating Hours */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {(hasCars || !lot.slots?.length) && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
              <Car size={13} style={{ color: 'var(--primary)' }} /> Car
            </span>
          )}
          {hasBikes && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
              <Bike size={13} style={{ color: '#0284c7' }} /> Bike
            </span>
          )}
          {hasSuvs && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
              <Car size={13} style={{ color: '#d97706' }} /> SUV
            </span>
          )}
          {hasEV && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
              <Zap size={13} /> EV Fast
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.78rem' }}>
          <Clock size={13} />
          <span>{lot.openingTime && lot.closingTime ? `${lot.openingTime} – ${lot.closingTime}` : '24x7 Open'}</span>
        </div>
      </div>

      {/* Footer: Price & Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.9rem',
          borderTop: '1px solid var(--border)',
          gap: '0.8rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
            Hourly Tariff
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
              ₹{startingPrice}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/ hour</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem' }}>
          <Link
            to={`/parking-lots/${lot.id}`}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', fontWeight: 600 }}
          >
            View Details
          </Link>
          <Link
            to={`/parking-lots/${lot.id}`}
            className="btn btn-primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              opacity: isFull ? 0.6 : 1,
              pointerEvents: isFull ? 'none' : 'auto'
            }}
          >
            {isFull ? 'Lot Full' : 'Reserve'} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParkingLotCard;
