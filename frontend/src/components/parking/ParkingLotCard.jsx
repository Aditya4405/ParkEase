import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Car, Bike, Shield, Zap, ArrowRight, Clock, Navigation } from 'lucide-react';

const ParkingLotCard = ({ lot, distance = null }) => {
  const hasCars = lot.slots?.some((s) => s.vehicleType === 'CAR' && s.active);
  const hasBikes = lot.slots?.some((s) => s.vehicleType === 'BIKE' && s.active);
  const hasSuvs = lot.slots?.some((s) => s.vehicleType === 'SUV' && s.active);
  const hasEV = lot.slots?.some((s) => s.vehicleType === 'EV' && s.active);

  const availableCount = lot.availableSlots !== undefined 
    ? lot.availableSlots 
    : lot.slots 
      ? lot.slots.filter((s) => s.isAvailable && s.active).length 
      : 0;

  const totalSlotsCount = lot.totalSlots !== undefined
    ? lot.totalSlots
    : lot.slots
      ? lot.slots.length
      : 0;

  const isFull = availableCount === 0;
  const isLimited = availableCount > 0 && availableCount <= 5;
  const isAvailable = availableCount > 5;

  // Calculate lowest price among active slots
  const minPrice = lot.startingPrice 
    || (lot.slots && lot.slots.length > 0 
        ? Math.min(...lot.slots.map((s) => s.price || 40)) 
        : 30);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Banner Accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: isFull 
            ? 'var(--danger)' 
            : isLimited 
              ? 'var(--warning)' 
              : 'linear-gradient(90deg, #4f46e5 0%, #0284c7 100%)',
        }}
      />

      <div>
        {/* Header: Title & Availability Status Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.6rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.3' }}>
            {lot.name}
          </h3>

          <span
            className={`status-pill ${isFull ? 'full' : isLimited ? 'limited' : 'available'}`}
            style={{ flexShrink: 0 }}
          >
            <span className="status-indicator-dot" />
            {isFull ? 'House Full' : isLimited ? `${availableCount} Left (Limited)` : `${availableCount} Slots Available`}
          </span>
        </div>

        {/* Location / Area */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
          <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
          <span>
            {lot.address}, <strong style={{ color: 'var(--text-main)' }}>{lot.city}</strong> – {lot.pincode}
          </span>
        </div>

        {/* Vehicle Support Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {hasCars && (
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              <Car size={13} style={{ color: 'var(--primary)' }} /> Car
            </span>
          )}
          {hasBikes && (
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              <Bike size={13} style={{ color: '#059669' }} /> Bike
            </span>
          )}
          {hasSuvs && (
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              <Shield size={13} style={{ color: '#d97706' }} /> SUV
            </span>
          )}
          {hasEV && (
            <span className="badge badge-success" style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
              <Zap size={13} style={{ color: '#10b981' }} /> EV Bay
            </span>
          )}
        </div>
      </div>

      {/* Footer: Price in INR & Action CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.9rem',
          borderTop: '1px solid var(--border)',
          marginTop: '0.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
            Tariff from
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{Number(minPrice).toFixed(0)}
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>/hr</span>
          </div>
        </div>

        <Link
          to={`/parking-lots/${lot.id}`}
          className="btn btn-primary btn-sm"
          style={{ padding: '0.45rem 0.95rem' }}
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ParkingLotCard;
