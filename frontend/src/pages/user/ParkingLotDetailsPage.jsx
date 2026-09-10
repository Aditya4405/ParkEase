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
  Navigation,
  ShieldCheck,
  CreditCard,
  Phone,
  Sparkles
} from 'lucide-react';

const ParkingLotDetailsPage = () => {
  const { id } = useParams();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchLotDetails = async () => {
      try {
        const res = await parkingApi.getParkingLotById(id);
        setLot(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLotDetails();
  }, [id]);

  // Check live slot status whenever lot is loaded or time/filter changes
  useEffect(() => {
    if (!lot) return;

    const checkSlots = async () => {
      setCheckingAvailability(true);
      try {
        const params = {
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        };
        if (vehicleTypeFilter !== 'ALL') {
          params.vehicleType = vehicleTypeFilter;
        }
        const res = await bookingApi.getAvailableSlots(lot.id, params);
        setSlotsAvailability(res.data);
      } catch (err) {
        console.error('Failed to check slot availability:', err);
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

  const handleDirectionsClick = () => {
    if (!lot) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${lot.name}, ${lot.address}, ${lot.city}, India`
    )}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) return <DetailsSkeleton />;
  if (error || !lot) return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <ErrorMessage error={error || 'Parking facility not found'} />
      <Link to="/parking-lots" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
        <ArrowLeft size={16} /> Back to Facilities
      </Link>
    </div>
  );

  const availableSlotsCount = lot.availableSlots !== undefined ? lot.availableSlots : (lot.slots ? lot.slots.filter(s => s.isAvailable).length : 0);
  const isFull = availableSlotsCount === 0;
  const isLimited = availableSlotsCount > 0 && availableSlotsCount <= 5;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/parking-lots" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Parking Facilities</span>
        </Link>
      </div>

      {/* Facility Header Card */}
      <div className="card" style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden', padding: '2rem' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #4f46e5 0%, #0284c7 100%)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            {/* Status Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              <span className={`status-pill ${isFull ? 'full' : isLimited ? 'limited' : 'available'}`}>
                <span className="status-indicator-dot" />
                {isFull ? 'House Full' : isLimited ? `${availableSlotsCount} Slots Left (Limited)` : `${availableSlotsCount} / ${lot.totalSlots || 24} Slots Available`}
              </span>
              <span className="badge badge-primary">
                🇮🇳 Verified Indian Parking Facility
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                <Clock size={12} /> Open: 09:00 AM – 11:30 PM
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.2' }}>
              {lot.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>{lot.address}, <strong style={{ color: 'var(--text-main)' }}>{lot.city}</strong> – {lot.pincode}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} style={{ color: 'var(--primary)' }} />
                <span>Operator: <strong>{lot.ownerName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={15} style={{ color: '#10b981' }} />
                <span>Zero Double-Booking Guarantee</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            textAlign: 'right',
            minWidth: '260px'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Tariff Starting At
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: '1.1' }}>
              ₹{lot.startingPrice ? Number(lot.startingPrice).toFixed(0) : '30'}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}> / hr</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.4rem 0 1.25rem' }}>
              Instant QR Gate Pass • UPI & Fastag Ready
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={() => openBookingModalWithSlot(null)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <Calendar size={16} />
                <span>Reserve Parking Bay</span>
              </button>

              <button
                onClick={handleDirectionsClick}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.6rem' }}
              >
                <Navigation size={15} style={{ color: '#0284c7' }} />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indian Vehicle Rates & Facilities Overview */}
      <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Tariff Matrix */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} style={{ color: 'var(--primary)' }} />
            Hourly Tariff Rates (₹)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <Car size={16} style={{ color: 'var(--primary)' }} /> 4-Wheeler / Car
              </span>
              <strong style={{ color: 'var(--text-main)' }}>₹40 / hr</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <Bike size={16} style={{ color: '#059669' }} /> 2-Wheeler / Bike
              </span>
              <strong style={{ color: 'var(--text-main)' }}>₹20 / hr</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <Shield size={16} style={{ color: '#d97706' }} /> SUV / Large Bay
              </span>
              <strong style={{ color: 'var(--text-main)' }}>₹60 / hr</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <Zap size={16} style={{ color: '#10b981' }} /> EV Fast Charging Bay
              </span>
              <strong style={{ color: '#059669' }}>₹40 / hr</strong>
            </div>
          </div>
        </div>

        {/* Facilities & Amenities */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            Facility Features
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} style={{ color: '#10b981' }} />
              <span>Multi-Level Covered Weatherproof Parking</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} style={{ color: '#10b981' }} />
              <span>24x7 HD CCTV Surveillance & Guards</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} style={{ color: '#10b981' }} />
              <span>Automated Boom Barrier & QR Scanner</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} style={{ color: '#10b981' }} />
              <span>Valet Parking & Wheelchair Friendly Access</span>
            </li>
          </ul>
        </div>

        {/* Operating Hours & Rules */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--primary)' }} />
            Timings & Access Policy
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>Opening Hours:</strong>
              <span>10:00 AM – 11:30 PM (Daily)</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>Cancellation Policy:</strong>
              <span>Free cancellation up to 30 mins before reserved start time.</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>Vehicle Entry:</strong>
              <span>Present your ParkEase digital QR ticket at the barrier.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Slot Interactive Availability Visualizer */}
      <div className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Live Parking Bay Layout & Real-Time Availability</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Select your vehicle type and intended duration below. Green slots are vacant and can be reserved instantly.
          </p>

          {/* Real-time Time & Vehicle Filter Controls */}
          <div className="grid-3" style={{ marginTop: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Vehicle Type Filter</label>
              <select
                className="form-select"
                value={vehicleTypeFilter}
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
              >
                <option value="ALL">All Vehicle Types</option>
                <option value="CAR">Car Slots (4-Wheeler)</option>
                <option value="BIKE">Bike Slots (2-Wheeler)</option>
                <option value="SUV">SUV Slots (Large Bay)</option>
                <option value="EV">EV Charging Bay ⚡</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Check In Date/Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Check Out Date/Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
            <span>Available (Click to Reserve)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
            <span>Occupied / Reserved</span>
          </div>
          {checkingAvailability && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Checking live slots...</span>
          )}
        </div>

        {/* Interactive Slots Grid */}
        {slotsAvailability.length > 0 ? (
          <div className="slot-grid">
            {slotsAvailability.map((slot) => (
              <div
                key={slot.id}
                onClick={() => slot.available && openBookingModalWithSlot(slot)}
                className={`slot-item ${slot.available ? 'available' : 'occupied'}`}
                style={{
                  padding: '1.15rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title={slot.available ? `Click to reserve slot ${slot.slotNumber}` : `Slot ${slot.slotNumber} is booked`}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: slot.available ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: slot.available ? '#065f46' : '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {slot.vehicleType === 'BIKE' ? <Bike size={18} /> : slot.vehicleType === 'SUV' ? <Shield size={18} /> : slot.vehicleType === 'EV' ? <Zap size={18} /> : <Car size={18} />}
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{slot.slotNumber}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {slot.size} • ₹{slot.price}/hr
                </div>
                <span className={`badge ${slot.available ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.62rem', marginTop: '0.25rem' }}>
                  {slot.available ? 'Vacant' : 'Occupied'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
            No slots configured for the selected filters in this parking lot.
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          lot={lot}
          preselectedSlot={selectedSlotForBooking}
          onBookingSuccess={() => {
            // refresh
          }}
        />
      )}
    </div>
  );
};

export default ParkingLotDetailsPage;
