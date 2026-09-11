import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Car, XCircle, CheckCircle, Receipt, CreditCard } from 'lucide-react';

const BookingCard = ({ booking, onCancel, cancellingId }) => {
  const isCancellable = booking.status === 'RESERVED' || booking.status === 'ACTIVE';

  const formatDateTime = (dtStr) => {
    if (!dtStr) return 'N/A';
    const d = new Date(dtStr);
    return d.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'RESERVED':
      case 'CONFIRMED':
        return (
          <span className="status-pill available" style={{ fontSize: '0.72rem' }}>
            <span className="status-indicator-dot" /> Confirmed
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="status-pill limited" style={{ fontSize: '0.72rem' }}>
            <span className="status-indicator-dot" /> Active Now
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>
            Cancelled
          </span>
        );
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `5px solid ${
          booking.status === 'RESERVED' || booking.status === 'CONFIRMED' ? '#4f46e5' :
          booking.status === 'ACTIVE' ? '#10b981' :
          booking.status === 'COMPLETED' ? '#94a3b8' : '#ef4444'
        }`,
      }}
    >
      <div>
        {/* Header: Lot Name & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pass #PE-BK-{String(booking.id).padStart(4, '0')}
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {booking.parkingLotName}
            </h4>
          </div>
          {getStatusPill(booking.status)}
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{booking.parkingLotAddress}, <strong>{booking.parkingLotCity}</strong></span>
        </div>

        {/* Slot Info & Vehicle Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            background: '#f8fafc',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
              Assigned Bay
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
              {booking.slotNumber}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
              ({booking.slotSize})
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
              Vehicle Plate
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Car size={13} style={{ color: 'var(--primary)' }} /> {booking.vehicleNumber || 'UP 32 EA 4455'}
            </span>
          </div>
        </div>

        {/* Timing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} style={{ color: 'var(--primary)' }} />
            <span><strong>Entry:</strong> {formatDateTime(booking.startTime)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={14} style={{ color: '#0284c7' }} />
            <span><strong>Exit:</strong> {formatDateTime(booking.endTime)}</span>
          </div>
        </div>
      </div>

      {/* Footer: Price in ₹ & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border)',
          marginTop: '0.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Tariff
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ₹{booking.totalPrice ? Number(booking.totalPrice).toFixed(0) : '0'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Link to={`/bookings/${booking.id}/ticket`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.65rem' }}>
            <span>QR Pass</span>
          </Link>

          <Link to={`/bookings/${booking.id}`} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.65rem' }}>
            <Receipt size={13} />
            <span>Details</span>
          </Link>

          {isCancellable && onCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={cancellingId === booking.id}
              className="btn btn-danger-outline btn-sm"
              style={{ padding: '0.35rem 0.6rem' }}
            >
              <XCircle size={13} />
              {cancellingId === booking.id ? '...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
