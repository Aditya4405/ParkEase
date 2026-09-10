import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../api/bookingApi';
import { 
  Calendar, 
  Clock, 
  Car, 
  Bike, 
  Shield, 
  Zap, 
  CheckCircle, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  QrCode, 
  CreditCard,
  Download,
  AlertCircle
} from 'lucide-react';
import Modal from '../common/Modal';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const BookingModal = ({ isOpen, onClose, lot, preselectedSlot, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Vehicle, 2: Time, 3: Slot, 4: Summary & Confirm, 5: Ticket

  // Format default times: next hour to next hour + 2 hours
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

  const [vehicleType, setVehicleType] = useState(preselectedSlot?.vehicleType || 'CAR');
  const [selectedSlotId, setSelectedSlotId] = useState(preselectedSlot?.id || null);
  const [startTime, setStartTime] = useState(getDefaultStartTime());
  const [endTime, setEndTime] = useState(getDefaultEndTime());
  const [vehicleNumber, setVehicleNumber] = useState(user?.vehicleNumber || 'UP 32 EA 4455');
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    if (preselectedSlot) {
      setSelectedSlotId(preselectedSlot.id);
      setVehicleType(preselectedSlot.vehicleType);
      setStep(3); // Jump to slot step if opened directly from a slot
    }
  }, [preselectedSlot]);

  useEffect(() => {
    if (user?.vehicleNumber) {
      setVehicleNumber(user.vehicleNumber);
    }
  }, [user]);

  // Fetch available slots when lot, vehicleType, or time range changes
  useEffect(() => {
    if (!isOpen || !lot?.id) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError(null);
      try {
        const params = {
          vehicleType,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        };
        const res = await bookingApi.getAvailableSlots(lot.id, params);
        setAvailableSlots(res.data);
        
        if (selectedSlotId) {
          const slotStillValid = res.data.find((s) => s.id === selectedSlotId && s.available);
          if (!slotStillValid) {
            const firstAvail = res.data.find((s) => s.available);
            setSelectedSlotId(firstAvail ? firstAvail.id : null);
          }
        } else {
          const firstAvail = res.data.find((s) => s.available);
          if (firstAvail) setSelectedSlotId(firstAvail.id);
        }
      } catch (err) {
        console.error('Failed to fetch slot availability:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [isOpen, lot?.id, vehicleType, startTime, endTime]);

  // Calculate estimated total price
  const calculateDurationHours = () => {
    if (!startTime || !endTime) return 2;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = Math.max(1, (end - start) / (1000 * 60 * 60));
    return diffHours;
  };

  const getActiveRate = () => {
    if (selectedSlotId) {
      const s = availableSlots.find((slot) => slot.id === selectedSlotId);
      if (s) return s.price;
    }
    if (vehicleType === 'BIKE') return 20;
    if (vehicleType === 'SUV') return 60;
    if (vehicleType === 'EV') return 40;
    return lot.startingPrice || 40;
  };

  const calculateTotal = () => {
    const hours = calculateDurationHours();
    const rate = getActiveRate();
    return Math.round(hours * rate);
  };

  const handleBookingConfirm = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        parkingLotId: lot.id,
        parkingSlotId: selectedSlotId || undefined,
        vehicleType,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        vehicleNumber: vehicleNumber.trim() || 'UP 32 EA 4455',
      };

      const response = await bookingApi.createBooking(payload);
      setCreatedBooking(response.data);
      setStep(5); // Show Confirmation Slip
      if (onBookingSuccess) onBookingSuccess(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSlotObj = availableSlots.find((s) => s.id === selectedSlotId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 5 ? 'Booking Confirmed • E-Ticket' : `Reserve Slot at ${lot?.name}`}
    >
      {/* 5-Step Progress Stepper */}
      {step < 5 && (
        <div className="stepper-nav" style={{ marginBottom: '1.75rem' }}>
          {[
            { num: 1, label: 'Vehicle' },
            { num: 2, label: 'Duration' },
            { num: 3, label: 'Slot' },
            { num: 4, label: 'Summary' },
          ].map((s) => (
            <div
              key={s.num}
              className={`step-item ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}
              onClick={() => step > s.num && setStep(s.num)}
            >
              <div className="step-number">
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* STEP 1: Select Vehicle */}
      {step === 1 && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Step 1: Choose Your Vehicle Category
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Select your vehicle to configure slot size and tariff rate.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {[
              { type: 'CAR', name: 'Car / Hatch / Sedan', icon: Car, rate: '₹40/hr', desc: 'Standard 4-wheeler bay' },
              { type: 'BIKE', name: 'Bike / Scooter', icon: Bike, rate: '₹20/hr', desc: 'Dedicated 2-wheeler slot' },
              { type: 'SUV', name: 'SUV / Premium', icon: Shield, rate: '₹60/hr', desc: 'Spacious wide-bay slot' },
              { type: 'EV', name: 'Electric Vehicle (EV)', icon: Zap, rate: '₹40/hr', desc: 'EV fast charger equipped' },
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = vehicleType === item.type;
              return (
                <div
                  key={item.type}
                  onClick={() => setVehicleType(item.type)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: isSelected ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ background: isSelected ? 'var(--primary)' : '#f1f5f9', color: isSelected ? '#ffffff' : 'var(--text-main)', padding: '0.4rem', borderRadius: '8px' }}>
                      <IconComp size={20} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {item.rate}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={() => setStep(2)} className="btn btn-primary">
              <span>Next: Set Duration</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date & Time Duration */}
      {step === 2 && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Step 2: Select Parking Duration
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Choose arrival time and expected exit time.
          </p>

          <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Check-In Date & Time
              </label>
              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Check-Out Date & Time
              </label>
              <input
                type="datetime-local"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration Summary Pill */}
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Total Duration: <strong style={{ color: 'var(--text-main)' }}>{calculateDurationHours().toFixed(1)} Hours</strong>
            </span>
            <span style={{ fontSize: '0.86rem', color: 'var(--primary)', fontWeight: 700 }}>
              Est. Rate: ₹{getActiveRate()}/hr
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
              <span>Next: Pick Slot</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Choose Parking Slot */}
      {step === 3 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Step 3: Choose Parking Slot
            </h4>
            {loadingSlots && <LoadingSpinner text="Checking live slots..." />}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Select a vacant bay for your {vehicleType}.
          </p>

          {availableSlots.length > 0 ? (
            <div className="slot-grid" style={{ maxHeight: '200px', overflowY: 'auto', padding: '4px', marginBottom: '1.5rem' }}>
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlotId(slot.id)}
                  className={`slot-item ${slot.available ? (selectedSlotId === slot.id ? 'selected' : 'available') : 'occupied'}`}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{slot.slotNumber}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{slot.price}/hr</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: slot.available ? 'var(--success-text)' : 'var(--danger-text)', marginTop: '2px' }}>
                    {slot.available ? (selectedSlotId === slot.id ? '✓ Selected' : 'Vacant') : 'Booked'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              No slots available for {vehicleType} during this time range. Try adjusting times.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={() => setStep(2)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="btn btn-primary"
              disabled={availableSlots.length > 0 && !selectedSlotId}
            >
              <span>Next: Review & Summary</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review Booking Summary & Vehicle Plate */}
      {step === 4 && (
        <form onSubmit={handleBookingConfirm}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Step 4: Booking Summary & Vehicle Plate
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Verify your reservation details before final confirmation.
          </p>

          {/* Vehicle License Plate Input */}
          <div className="form-group">
            <label className="form-label">Vehicle Registration Plate (India Format)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. UP 32 EA 4455 / DL 01 AB 8899"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
          </div>

          {/* Structured Booking Summary Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Parking Facility:</span>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{lot?.name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Location / City:</span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{lot?.city}, Uttar Pradesh</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Assigned Slot & Vehicle:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '0.88rem' }}>
                Slot {selectedSlotObj?.slotNumber || 'Auto-Assigned'} ({vehicleType})
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Duration ({calculateDurationHours().toFixed(1)} hrs):</span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>
                {new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              style={{
                borderTop: '1px dashed var(--border)',
                paddingTop: '0.75rem',
                marginTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Estimated Amount
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>
                  Includes all applicable parking cess
                </span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{calculateTotal()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={() => setStep(3)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button type="submit" className="btn btn-emerald" disabled={submitting}>
              {submitting ? <LoadingSpinner text="Confirming Reservation..." /> : 'Confirm & Reserve Slot'}
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: Instant E-Ticket Confirmation Slip */}
      {step === 5 && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <CheckCircle size={32} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Reservation Confirmed!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Your parking bay has been reserved. Present this digital slip at the parking gate barrier.
          </p>

          {/* Ticket Slip Card */}
          <div
            style={{
              background: '#ffffff',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Booking ID
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                  #PK-{createdBooking?.id ? String(createdBooking.id).padStart(5, '0') : '00482'}
                </div>
              </div>
              <span className="badge badge-success">Confirmed</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.86rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Location</span>
                <strong>{lot?.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Assigned Slot</span>
                <strong style={{ color: 'var(--primary)' }}>{createdBooking?.slotNumber || selectedSlotObj?.slotNumber || 'A-101'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Vehicle Number</span>
                <strong>{vehicleNumber}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Total Paid/Due</span>
                <strong style={{ color: '#059669' }}>₹{createdBooking?.totalPrice || calculateTotal()}</strong>
              </div>
            </div>

            {/* QR Code Graphic Box */}
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <QrCode size={36} style={{ color: 'var(--text-main)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Scan at Gate Barrier</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fastag & UPI Auto-Checkout</div>
                </div>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>Fast Access</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/my-bookings');
              }}
              className="btn btn-primary"
            >
              <span>View in My Bookings</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
