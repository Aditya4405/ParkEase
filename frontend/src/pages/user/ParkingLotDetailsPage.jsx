import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import { bookingApi } from '../../api/bookingApi';
import BookingModal from '../../components/booking/BookingModal';
import SkeletonLoader, { DetailsSkeleton } from '../../components/common/SkeletonLoader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  Building2, 
  MapPin, 
  Car, 
  Bike, 
  Shield, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  Info, 
  User,
  Zap,
  ShieldCheck,
  CreditCard,
  Phone,
  Database,
  Tag,
  Radio,
  RotateCw,
  Layers
} from 'lucide-react';

const ParkingLotDetailsPage = () => {
  const { id } = useParams();
  const [lot, setLot] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Time filter state for live slot availability checker
  const getDefaultStartTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };
  const getDefaultEndTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 3, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState(getDefaultStartTime());
  const [endTime, setEndTime] = useState(getDefaultEndTime());
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL');
  const [slotsAvailability, setSlotsAvailability] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);

  const fetchLotDetails = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [lotRes, availRes] = await Promise.all([
        parkingApi.getParkingLotById(id),
        parkingApi.getAvailability(id).catch(() => null)
      ]);

      setLot(lotRes.data);
      if (availRes?.data) {
        setAvailability(availRes.data);
      }
    } catch (err) {
      console.error('Failed to load parking lot details:', err);
      setError(err.response?.data?.message || 'Unable to fetch parking facility details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLotDetails();
  }, [id]);

  // Check custom slot availability
  useEffect(() => {
    if (!lot) return;

    const checkSlots = async () => {
      setCheckingAvailability(true);
      try {
        const typeParam = vehicleTypeFilter !== 'ALL' ? vehicleTypeFilter : null;
        const res = await bookingApi.getAvailableSlots(id, typeParam, startTime, endTime);
        setSlotsAvailability(res.data || []);
      } catch (err) {
        console.error('Failed to check slot conflicts:', err);
        setSlotsAvailability(
          (lot.slots || []).map((s) => ({
            slotId: s.id,
            slotNumber: s.slotNumber,
            price: s.price,
            size: s.size,
            vehicleType: s.vehicleType,
            available: s.isAvailable && s.active,
          }))
        );
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkSlots();
  }, [lot, startTime, endTime, vehicleTypeFilter]);

  const openBookingModalWithSlot = (slot) => {
    setSelectedSlotForBooking(slot);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <DetailsSkeleton />
      </div>
    );
  }

  if (error || !lot) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <ErrorMessage message={error || 'Parking facility not found'} />
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/parking-lots" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Return to Discovery Search</span>
          </Link>
        </div>
      </div>
    );
  }

  const totalCapacity = availability?.totalCapacity || lot.totalCapacity || lot.totalSlots || 100;
  const occupied = availability?.occupiedSlots || lot.occupiedSlots || 0;
  const reserved = availability?.reservedSlots || lot.reservedSlots || 0;
  const availableSlotsCount = availability?.availableSlots !== undefined ? availability.availableSlots : Math.max(0, totalCapacity - occupied - reserved);

  const isFull = availableSlotsCount === 0;
  const isLimited = availableSlotsCount > 0 && availableSlotsCount <= Math.max(5, Math.floor(totalCapacity * 0.15));

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      
      {/* Back Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link
          to="/parking-lots"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Parking Results</span>
        </Link>

        <button
          onClick={() => fetchLotDetails(true)}
          className="btn btn-secondary"
          disabled={refreshing}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RotateCw size={13} className={refreshing ? 'spin' : ''} />
          <span>{refreshing ? 'Updating...' : 'Sync Live Telemetry'}</span>
        </button>
      </div>

      {/* Hero Facility Header Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          borderRadius: '18px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* Left Details */}
          <div style={{ maxWidth: '650px' }}>
            
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className={`status-pill ${isFull ? 'full' : isLimited ? 'limited' : 'available'}`} style={{ fontSize: '0.8rem' }}>
                <span className="dot" />
                {isFull ? '🔴 Full (0 slots)' : isLimited ? `🟡 Limited (${availableSlotsCount} slots left)` : `🟢 ${availableSlotsCount} Bays Open`}
              </span>

              <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '999px', background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
                {lot.parkingType || 'Multi-Level Covered'}
              </span>

              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '999px', background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Database size={12} /> {lot.dataSource === 'OPENSTREETMAP' ? 'OpenStreetMap Verified' : 'Operator Registered'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.25', marginBottom: '0.4rem' }}>
              {lot.name}
            </h1>

            {lot.nearbyDestination && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.92rem', color: '#0369a1', fontWeight: 600, marginBottom: '0.4rem' }}>
                <Tag size={15} />
                <span>Primary Destination: {lot.nearbyDestination}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '0.8rem' }}>
              <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>{lot.address}, <strong style={{ color: 'var(--text-main)' }}>{lot.city}</strong>, {lot.state || 'Uttar Pradesh'} – {lot.pincode}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.84rem', color: '#64748b', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                <span>Operating Hours: <strong>{lot.openingTime && lot.closingTime ? `${lot.openingTime} – ${lot.closingTime}` : '24x7 Open'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} />
                <span>Operator: <strong>{lot.ownerName}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action & Pricing Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem',
              textAlign: 'right',
              minWidth: '240px',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Starting Tariff
            </span>
            <div style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--primary)', lineHeight: '1.1' }}>
              ₹{Number(lot.startingPrice || 40).toFixed(0)}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}> / hour</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.4rem 0 1.2rem' }}>
              Guaranteed Reservation • Instant QR Pass
            </p>

            <button
              onClick={() => openBookingModalWithSlot(null)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700, fontSize: '0.92rem' }}
              disabled={isFull}
            >
              <Calendar size={16} />
              <span>{isFull ? 'Facility Full' : 'Reserve Parking Slot'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Section: Real-Time Operational Telemetry + Facility Amenities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="details-grid">
        
        {/* Dynamic Telemetry Box */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              <Radio size={18} style={{ color: '#059669' }} />
              <span>Live Operational Capacity Telemetry</span>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Formula: Available = Total - Occupied - Reserved
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', textAlign: 'center', marginBottom: '1.2rem' }}>
            <div style={{ padding: '1rem 0.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Capacity</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>{totalCapacity}</div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Bays</span>
            </div>

            <div style={{ padding: '1rem 0.5rem', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3' }}>
              <span style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: 700, textTransform: 'uppercase' }}>Physical Occupancy</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e11d48', marginTop: '0.2rem' }}>{occupied}</div>
              <span style={{ fontSize: '0.7rem', color: '#be123c' }}>In Facility</span>
            </div>

            <div style={{ padding: '1rem 0.5rem', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>Active Reserved</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>{reserved}</div>
              <span style={{ fontSize: '0.7rem', color: '#b45309' }}>Hold Bays</span>
            </div>

            <div style={{ padding: '1rem 0.5rem', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Bookable Open</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>{availableSlotsCount}</div>
              <span style={{ fontSize: '0.7rem', color: '#047857' }}>Ready to Park</span>
            </div>
          </div>

          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.76rem', color: '#475569', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>Simulated boom-barrier entry/exit sensor telemetry synced with ParkEase backend state engine.</span>
          </div>
        </div>

        {/* Facility Tariffs & Amenities */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)' }}>
            <CreditCard size={18} style={{ color: 'var(--primary)' }} />
            <span>Vehicle Tariffs & Facilities</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Car size={16} style={{ color: 'var(--primary)' }} /> 4-Wheeler / Hatchback / Sedan
              </span>
              <strong style={{ color: 'var(--text-main)' }}>₹40 / hr</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Bike size={16} style={{ color: '#0284c7' }} /> 2-Wheeler / Motorcycle / Scooter
              </span>
              <strong style={{ color: 'var(--text-main)' }}>₹20 / hr</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Shield size={16} style={{ color: '#d97706' }} /> SUV / Large Bay
              </span>
              <strong style={{ color: 'var(--text-main)' }}>₹60 / hr</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 600 }}>
                <Zap size={16} /> EV Fast Charging (CCS2 & Type 2)
              </span>
              <strong style={{ color: '#059669' }}>₹50 / hr</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', background: '#f1f5f9', borderRadius: '6px', color: '#475569' }}>CCTV Monitored</span>
            <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', background: '#f1f5f9', borderRadius: '6px', color: '#475569' }}>Fastag Auto-Pay</span>
            <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', background: '#f1f5f9', borderRadius: '6px', color: '#475569' }}>Covered Multi-Tier</span>
            <span style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', background: '#f1f5f9', borderRadius: '6px', color: '#475569' }}>24x7 Security</span>
          </div>
        </div>
      </div>

      {/* Interactive Slot Conflict & Availability Matrix */}
      <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Select Specific Parking Bay & Time Window
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Check bay-level conflict matrix for your specific schedule.
            </p>
          </div>

          {/* Time & Vehicle Filters */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="form-control"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem', height: '38px' }}
            >
              <option value="ALL">All Vehicle Slots</option>
              <option value="CAR">Car Slots</option>
              <option value="BIKE">Bike Slots</option>
              <option value="SUV">SUV Slots</option>
              <option value="EV">EV Slots</option>
            </select>

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="form-control"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', height: '38px' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>to</span>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="form-control"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', height: '38px' }}
            />
          </div>
        </div>

        {/* Slot Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.9rem' }}>
          {checkingAvailability ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ height: '90px', background: '#f1f5f9', borderRadius: '10px' }} />
            ))
          ) : slotsAvailability.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No parking slots found matching the selected vehicle filter.
            </div>
          ) : (
            slotsAvailability.map((s) => {
              const isSlotOpen = s.available;
              return (
                <div
                  key={s.slotId}
                  onClick={() => isSlotOpen && openBookingModalWithSlot(s)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: isSlotOpen ? '1px solid #cbd5e1' : '1px solid #fecdd3',
                    background: isSlotOpen ? '#ffffff' : '#fff1f2',
                    cursor: isSlotOpen ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    if (isSlotOpen) {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isSlotOpen) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '1rem', color: isSlotOpen ? 'var(--text-main)' : '#9f1239' }}>
                      {s.slotNumber}
                    </strong>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 700, 
                      padding: '0.15rem 0.4rem', 
                      borderRadius: '4px',
                      background: isSlotOpen ? '#ecfdf5' : '#fee2e2',
                      color: isSlotOpen ? '#059669' : '#dc2626'
                    }}>
                      {isSlotOpen ? 'Open' : 'Booked'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>{s.vehicleType}</span>
                    <strong style={{ color: 'var(--primary)' }}>₹{s.price}/hr</strong>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5-Step Booking Reservation Modal */}
      {isModalOpen && (
        <BookingModal
          lot={lot}
          initialSlot={selectedSlotForBooking}
          initialStartTime={startTime}
          initialEndTime={endTime}
          onClose={() => {
            setIsModalOpen(false);
            fetchLotDetails();
          }}
        />
      )}

      <style>{`
        @media (max-width: 850px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ParkingLotDetailsPage;
