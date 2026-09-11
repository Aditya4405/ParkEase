import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { parkingApi } from '../../api/parkingApi';
import { bookingApi } from '../../api/bookingApi';
import { paymentApi } from '../../api/paymentApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  Calendar, 
  Clock, 
  Car, 
  Bike, 
  Shield, 
  Zap, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Printer, 
  QrCode, 
  Tag, 
  Check, 
  RotateCw,
  Info,
  Building2,
  ShieldCheck
} from 'lucide-react';

const ReservationPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Selected initial slot from query param if provided
  const initialSlotIdParam = searchParams.get('slotId') ? parseInt(searchParams.get('slotId')) : null;

  // Step state: 1 = Date & Time, 2 = Select Slot, 3 = Summary, 4 = Payment, 5 = Confirmed
  const [currentStep, setCurrentStep] = useState(1);

  // Lot Details state
  const [lot, setLot] = useState(null);
  const [loadingLot, setLoadingLot] = useState(true);
  const [lotError, setLotError] = useState(null);

  // Helper date generators (Local Indian Time)
  const getTodayDateStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDefaultStartTimeStr = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  };

  const getDefaultEndTimeStr = () => {
    const d = new Date();
    d.setHours(d.getHours() + 3, 0, 0, 0);
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  };

  // Reservation Form State
  const [bookingDate, setBookingDate] = useState(getTodayDateStr());
  const [startTimeStr, setStartTimeStr] = useState(getDefaultStartTimeStr());
  const [endTimeStr, setEndTimeStr] = useState(getDefaultEndTimeStr());
  const [vehicleType, setVehicleType] = useState('CAR');
  const [vehicleNumber, setVehicleNumber] = useState(user?.vehicleNumber || '');

  // Slots State
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotError, setSlotError] = useState(null);

  // Booking & Payment State
  const [createdBooking, setCreatedBooking] = useState(null);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  // 1. Fetch Parking Lot Details
  useEffect(() => {
    const fetchLot = async () => {
      try {
        setLoadingLot(true);
        setLotError(null);
        const res = await parkingApi.getParkingLotById(id);
        setLot(res.data);
      } catch (err) {
        console.error('Failed to load parking lot for reservation:', err);
        setLotError(err.response?.data?.message || 'Unable to load parking facility details.');
      } finally {
        setLoadingLot(false);
      }
    };

    fetchLot();
  }, [id]);

  // Update vehicle number if user loads late
  useEffect(() => {
    if (user?.vehicleNumber && !vehicleNumber) {
      setVehicleNumber(user.vehicleNumber);
    }
  }, [user]);

  // Combine Date + Time string into ISO datetime string
  const getFullStartDateTime = () => {
    if (!bookingDate || !startTimeStr) return null;
    return `${bookingDate}T${startTimeStr}:00`;
  };

  const getFullEndDateTime = () => {
    if (!bookingDate || !endTimeStr) return null;
    return `${bookingDate}T${endTimeStr}:00`;
  };

  // 2. Fetch Available Slots for the chosen interval and vehicle type
  const fetchSlotAvailability = async () => {
    if (!lot) return;

    const startIso = getFullStartDateTime();
    const endIso = getFullEndDateTime();

    if (!startIso || !endIso) {
      setSlotError('Please select a valid booking date, start time, and end time.');
      return;
    }

    const startDate = new Date(startIso);
    const endDate = new Date(endIso);
    const now = new Date();

    if (startDate >= endDate) {
      setSlotError('Start time must be strictly before end time.');
      return;
    }

    // Allow 5 minutes past tolerance
    if (startDate < new Date(now.getTime() - 5 * 60 * 1000)) {
      setSlotError('Start time cannot be in the past.');
      return;
    }

    try {
      setLoadingSlots(true);
      setSlotError(null);

      const params = {
        vehicleType,
        startTime: startIso,
        endTime: endIso,
      };

      const res = await bookingApi.getAvailableSlots(lot.id, params);
      const slots = res.data || [];
      setAvailableSlots(slots);

      // Auto-select initial slot or first available slot
      if (initialSlotIdParam && !selectedSlot) {
        const matching = slots.find((s) => s.id === initialSlotIdParam);
        if (matching && matching.available) {
          setSelectedSlot(matching);
        }
      } else if (selectedSlot) {
        const stillAvailable = slots.find((s) => s.id === selectedSlot.id && s.available);
        if (!stillAvailable) {
          setSelectedSlot(null);
        } else {
          setSelectedSlot(stillAvailable);
        }
      }
    } catch (err) {
      console.error('Failed to check slot availability:', err);
      setSlotError(err.response?.data?.message || 'Unable to retrieve slot availability from server.');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Trigger availability fetch on entering slot step or changing filters
  useEffect(() => {
    if (lot && (currentStep === 1 || currentStep === 2)) {
      fetchSlotAvailability();
    }
  }, [lot, bookingDate, startTimeStr, endTimeStr, vehicleType]);

  // Duration & Price Calculations
  const calculateDurationHours = () => {
    const startIso = getFullStartDateTime();
    const endIso = getFullEndDateTime();
    if (!startIso || !endIso) return 2.0;

    const start = new Date(startIso);
    const end = new Date(endIso);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(1.0, Math.round(diffHours * 10) / 10);
  };

  const calculateTotalPrice = () => {
    const hours = calculateDurationHours();
    const hourlyRate = selectedSlot?.price || lot?.startingPrice || 40.0;
    return Math.round(hours * hourlyRate * 100.0) / 100.0;
  };

  // Navigation between steps
  const handleProceedToSlotSelection = (e) => {
    e.preventDefault();
    const startIso = getFullStartDateTime();
    const endIso = getFullEndDateTime();

    if (!startIso || !endIso) {
      setSlotError('Please select both start and end times.');
      return;
    }

    const startDate = new Date(startIso);
    const endDate = new Date(endIso);
    const now = new Date();

    if (startDate >= endDate) {
      setSlotError('Start time must be before end time.');
      return;
    }

    if (startDate < new Date(now.getTime() - 5 * 60 * 1000)) {
      setSlotError('Selected booking start time is in the past. Please choose a future time.');
      return;
    }

    setSlotError(null);
    setCurrentStep(2);
  };

  const handleProceedToSummary = () => {
    if (!selectedSlot) {
      setSlotError('Please select an available parking bay to continue.');
      return;
    }
    setSlotError(null);
    setCurrentStep(3);
  };

  // Create Booking in Backend
  const handleCreateBookingAndProceedToPayment = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      setBookingError('Please select a parking bay.');
      return;
    }

    try {
      setCreatingBooking(true);
      setBookingError(null);

      const payload = {
        parkingLotId: lot.id,
        parkingSlotId: selectedSlot.id,
        vehicleType: vehicleType,
        startTime: getFullStartDateTime(),
        endTime: getFullEndDateTime(),
        vehicleNumber: vehicleNumber.trim() || user?.vehicleNumber || 'UP 32 EA 4455',
      };

      const res = await bookingApi.createBooking(payload);
      setCreatedBooking(res.data);
      setCurrentStep(4); // Move to Payment Step
    } catch (err) {
      console.error('Booking creation error:', err);
      const statusCode = err.response?.status;
      if (statusCode === 409) {
        setBookingError('This parking slot was just reserved by another user. Please select another slot.');
        fetchSlotAvailability();
        setCurrentStep(2); // Go back to slot selection
      } else {
        setBookingError(err.response?.data?.message || 'Unable to reserve parking slot. Please try again.');
      }
    } finally {
      setCreatingBooking(false);
    }
  };

  // Process Payment
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!createdBooking) {
      setPaymentError('No active reservation to pay for.');
      return;
    }

    try {
      setProcessingPayment(true);
      setPaymentError(null);

      const payload = {
        bookingId: createdBooking.id,
        paymentMethod: paymentMethod,
      };

      const res = await paymentApi.processPayment(payload);
      setPaymentResult(res.data);
      setCurrentStep(5); // Move to Confirmed & Ticket Step
    } catch (err) {
      console.error('Payment processing failed:', err);
      setPaymentError(err.response?.data?.message || 'Payment authorization failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loadingLot) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <LoadingSpinner text="Loading parking facility & booking engine..." />
      </div>
    );
  }

  if (lotError || !lot) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <ErrorMessage message={lotError || 'Parking facility not found'} />
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/find-parking" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Return to Discovery</span>
          </Link>
        </div>
      </div>
    );
  }

  const durationHours = calculateDurationHours();
  const totalPrice = calculateTotalPrice();
  const bookingReference = createdBooking ? `PE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(createdBooking.id).padStart(6, '0')}` : '';

  return (
    <div className="container reservation-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link
          to={`/parking-lots/${lot.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Facility Details</span>
        </Link>

        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
          Step {currentStep} of 5
        </span>
      </div>

      {/* Stepper Wizard Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1rem 1.5rem',
        marginBottom: '1.75rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {[
          { num: 1, label: 'Date & Time' },
          { num: 2, label: 'Select Bay' },
          { num: 3, label: 'Review Summary' },
          { num: 4, label: 'Demo Payment' },
          { num: 5, label: 'Confirmed Pass' },
        ].map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: isDone ? 'pointer' : 'default',
                opacity: isActive || isDone ? 1 : 0.5,
              }}
              onClick={() => isDone && setCurrentStep(s.num)}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isActive ? 'var(--primary)' : isDone ? '#10b981' : '#e2e8f0',
                color: isActive || isDone ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.82rem',
                fontWeight: 800
              }}>
                {isDone ? '✓' : s.num}
              </div>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? 'var(--primary)' : isDone ? '#0f172a' : '#64748b'
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 1 Facility Info Banner */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
              {lot.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.84rem' }}>
              <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>{lot.address}, <strong style={{ color: '#334155' }}>{lot.city}</strong> {lot.pincode ? `(${lot.pincode})` : ''}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Operating Hours
            </span>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
              {lot.openingTime && lot.closingTime ? `${lot.openingTime} – ${lot.closingTime}` : '24x7 Open'}
            </strong>
          </div>

          <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Tariff
            </span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 900 }}>
              ₹{lot.startingPrice || 40}
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>/hr</span>
            </strong>
          </div>
        </div>
      </div>

      {/* STEP 1: DATE, TIME & VEHICLE SELECTION */}
      {currentStep === 1 && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Select Booking Date & Schedule
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Choose your reservation date, vehicle category, and parking time window.
          </p>

          {slotError && (
            <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecdd3', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{slotError}</span>
            </div>
          )}

          {/* Vehicle Category Selector */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
              Vehicle Category
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {[
                { type: 'CAR', label: 'Car / Sedan', icon: Car, rate: '₹40/hr' },
                { type: 'BIKE', label: 'Bike / Scooter', icon: Bike, rate: '₹20/hr' },
                { type: 'SUV', label: 'SUV / Large', icon: Shield, rate: '₹60/hr' },
                { type: 'EV', label: 'Electric (EV)', icon: Zap, rate: '₹40/hr' },
              ].map((v) => {
                const IconComponent = v.icon;
                const isSelected = vehicleType === v.type;
                return (
                  <button
                    key={v.type}
                    type="button"
                    onClick={() => setVehicleType(v.type)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '0.9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center'
                    }}
                  >
                    <IconComponent size={22} color={isSelected ? 'var(--primary)' : '#64748b'} />
                    <strong style={{ fontSize: '0.88rem', color: isSelected ? 'var(--primary)' : '#0f172a' }}>{v.label}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.rate}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Booking Date
              </label>
              <input
                type="date"
                className="form-control"
                min={getTodayDateStr()}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Entry Time
              </label>
              <input
                type="time"
                className="form-control"
                value={startTimeStr}
                onChange={(e) => setStartTimeStr(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Exit Time
              </label>
              <input
                type="time"
                className="form-control"
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                required
              />
            </div>
          </div>

          {/* Schedule Duration Estimate Banner */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={18} color="var(--primary)" />
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block' }}>
                  {durationHours} Hours Duration
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {bookingDate} • {startTimeStr} to {endTimeStr}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Estimated Tariff</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 900 }}>
                ₹{totalPrice}
              </strong>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleProceedToSlotSelection}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 800,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Check Bay Availability & Select Slot</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: SELECT PARKING SLOT */}
      {currentStep === 2 && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                Select Your Parking Bay
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                Live bay availability for {bookingDate} ({startTimeStr} – {endTimeStr})
              </p>
            </div>

            <button
              onClick={fetchSlotAvailability}
              className="btn btn-secondary"
              disabled={loadingSlots}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCw size={14} className={loadingSlots ? 'spin' : ''} />
              <span>{loadingSlots ? 'Rechecking...' : 'Refresh Bays'}</span>
            </button>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#065f46', fontWeight: 600 }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} /> Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600 }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)' }} /> Selected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#991b1b', fontWeight: 600 }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} /> Occupied / Booked
            </span>
          </div>

          {slotError && (
            <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecdd3', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              {slotError}
            </div>
          )}

          {/* Slot Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {loadingSlots ? (
              [1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} style={{ height: '90px', background: '#f1f5f9', borderRadius: '12px' }} />
              ))
            ) : availableSlots.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <p>No parking bays found matching the selected vehicle type.</p>
                <button onClick={() => setCurrentStep(1)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
                  Adjust Vehicle or Time
                </button>
              </div>
            ) : (
              availableSlots.map((slot, idx) => {
                const isSelected = selectedSlot?.id === slot.id;
                const isOpen = slot.available;
                const slotKey = slot.id || `slot-${idx}-${slot.slotNumber}`;

                return (
                  <div
                    key={slotKey}
                    onClick={() => isOpen && setSelectedSlot(slot)}
                    style={{
                      background: isSelected ? '#eff6ff' : isOpen ? '#ffffff' : '#fff1f2',
                      border: isSelected ? '2px solid var(--primary)' : isOpen ? '1px solid #cbd5e1' : '1px solid #fecdd3',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: isOpen ? 'pointer' : 'not-allowed',
                      boxShadow: isSelected ? '0 0 0 3px rgba(79, 70, 229, 0.15)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '1.15rem', color: isSelected ? 'var(--primary)' : isOpen ? '#0f172a' : '#991b1b' }}>
                        {slot.slotNumber}
                      </strong>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: isSelected ? 'var(--primary)' : isOpen ? '#d1fae5' : '#fee2e2',
                        color: isSelected ? '#ffffff' : isOpen ? '#065f46' : '#991b1b',
                      }}>
                        {isSelected ? 'SELECTED' : isOpen ? 'OPEN' : 'BOOKED'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                      <span>{slot.vehicleType}</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.86rem' }}>₹{slot.price}/hr</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Slot Information Bar */}
          {selectedSlot && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 800, textTransform: 'uppercase' }}>
                  Selected Bay
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#065f46' }}>
                  Bay {selectedSlot.slotNumber} ({selectedSlot.vehicleType})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700 }}>Tariff Rate</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#065f46' }}>
                  ₹{selectedSlot.price} / hour
                </div>
              </div>
            </div>
          )}

          {/* Step Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToSummary}
              className="btn btn-primary"
              disabled={!selectedSlot}
              style={{ padding: '0.75rem 1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Continue to Summary</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BOOKING SUMMARY & DETAILS */}
      {currentStep === 3 && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Booking Summary & Vehicle Details
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Review your guaranteed reservation breakdown before proceeding to payment.
          </p>

          {bookingError && (
            <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecdd3', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{bookingError}</span>
            </div>
          )}

          {/* Vehicle Number Input */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
              Vehicle Registration Number (License Plate)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. UP 32 EA 4455 / DL 01 AB 1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
              required
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.35rem' }}>
              This plate number will be matched at the parking boom barrier or entrance pass scanner.
            </span>
          </div>

          {/* Structured Summary Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
              <span style={{ color: '#64748b' }}>Parking Facility</span>
              <strong style={{ color: '#0f172a' }}>{lot.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
              <span style={{ color: '#64748b' }}>Allocated Bay</span>
              <strong style={{ color: 'var(--primary)' }}>Bay {selectedSlot?.slotNumber} ({vehicleType})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
              <span style={{ color: '#64748b' }}>Date & Schedule</span>
              <strong style={{ color: '#0f172a' }}>{bookingDate} • {startTimeStr} to {endTimeStr}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
              <span style={{ color: '#64748b' }}>Duration</span>
              <strong style={{ color: '#0f172a' }}>{durationHours} Hours</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
              <span style={{ color: '#64748b' }}>Tariff Rate</span>
              <strong style={{ color: '#0f172a' }}>₹{selectedSlot?.price || lot.startingPrice}/hour</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: '#eff6ff', fontSize: '1rem' }}>
              <strong style={{ color: '#0f172a' }}>Total Amount Payable</strong>
              <strong style={{ color: 'var(--primary)', fontSize: '1.4rem', fontWeight: 900 }}>₹{totalPrice}</strong>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Bays</span>
            </button>

            <button
              type="button"
              onClick={handleCreateBookingAndProceedToPayment}
              disabled={creatingBooking}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <CreditCard size={16} />
              <span>{creatingBooking ? 'Securing Slot...' : `Proceed to Payment (₹${totalPrice})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DEMO PAYMENT GATEWAY */}
      {currentStep === 4 && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Payment Stage
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Complete your demo payment transaction to confirm and generate your digital pass.
          </p>

          {/* Demo Sandbox Alert Badge */}
          <div style={{
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            color: '#0369a1',
            fontSize: '0.84rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <ShieldCheck size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Demo Payment Gateway Active:</strong> This is a prototype payment simulation. No real money will be charged from your account.
            </div>
          </div>

          {paymentError && (
            <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecdd3', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              {paymentError}
            </div>
          )}

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'WALLET', label: 'NetBanking / Wallet', icon: Wallet },
              ].map((m) => {
                const IconComp = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <IconComp size={20} color={isSelected ? 'var(--primary)' : '#64748b'} />
                    <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? 'var(--primary)' : '#0f172a' }}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Details Form */}
          <form onSubmit={handleProcessPayment}>
            {paymentMethod === 'UPI' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  UPI Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. mobile@okaxis / commuter@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Card Number (Demo)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="4532 •••• •••• 8899"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    CVV (Demo Mock)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    className="form-control"
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'WALLET' && (
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', fontSize: '0.86rem', color: '#475569' }}>
                Instant Mock Authorization enabled via ParkEase Instant Wallet Sandbox.
              </div>
            )}

            {/* Total Pay Box */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Final Settlement</span>
                <strong style={{ fontSize: '1rem', color: '#0f172a', display: 'block' }}>Guaranteed Slot Bay {selectedSlot?.slotNumber}</strong>
              </div>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 900 }}>
                ₹{createdBooking?.totalPrice || totalPrice}
              </strong>
            </div>

            {/* Submit Payment */}
            <button
              type="submit"
              disabled={processingPayment}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={18} />
              <span>{processingPayment ? 'Authorizing Demo Payment...' : `Complete Payment • ₹${createdBooking?.totalPrice || totalPrice}`}</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 5: BOOKING CONFIRMED & DIGITAL QR PARKING PASS */}
      {currentStep === 5 && (
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          
          {/* Success Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}>
              <Check size={28} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.35rem' }}>
              Booking Confirmed!
            </h2>
            <p style={{ margin: 0, fontSize: '0.92rem', opacity: 0.95 }}>
              Your parking bay has been reserved. Present the digital QR pass below at the entry gate.
            </p>
          </div>

          {/* Printable Ticket Card */}
          <div
            id="printable-parking-pass"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '2px solid #e2e8f0',
              padding: '2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              marginBottom: '1.5rem',
              position: 'relative'
            }}
          >
            {/* Pass Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  Park<span style={{ color: 'var(--primary)' }}>Ease</span> Pass
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Digital Entry Permit
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Pass Reference</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--primary)' }}>
                  {bookingReference}
                </strong>
              </div>
            </div>

            {/* QR Code + Pass Core Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }} className="pass-grid">
              
              {/* QR Code Container */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  background: '#ffffff',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  marginBottom: '0.4rem'
                }}>
                  {/* Visual QR Code SVG Representation */}
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white"/>
                    <rect x="5" y="5" width="30" height="30" fill="#0f172a"/>
                    <rect x="10" y="10" width="20" height="20" fill="white"/>
                    <rect x="15" y="15" width="10" height="10" fill="#0f172a"/>
                    
                    <rect x="65" y="5" width="30" height="30" fill="#0f172a"/>
                    <rect x="70" y="10" width="20" height="20" fill="white"/>
                    <rect x="75" y="15" width="10" height="10" fill="#0f172a"/>
                    
                    <rect x="5" y="65" width="30" height="30" fill="#0f172a"/>
                    <rect x="10" y="70" width="20" height="20" fill="white"/>
                    <rect x="15" y="75" width="10" height="10" fill="#0f172a"/>

                    <rect x="42" y="10" width="6" height="6" fill="#0f172a"/>
                    <rect x="52" y="10" width="6" height="6" fill="#0f172a"/>
                    <rect x="42" y="24" width="6" height="6" fill="#0f172a"/>
                    <rect x="52" y="24" width="6" height="6" fill="#0f172a"/>
                    
                    <rect x="42" y="42" width="16" height="16" fill="var(--primary)"/>
                    <rect x="65" y="45" width="8" height="8" fill="#0f172a"/>
                    <rect x="78" y="45" width="8" height="8" fill="#0f172a"/>
                    <rect x="65" y="58" width="8" height="8" fill="#0f172a"/>
                    <rect x="78" y="58" width="8" height="8" fill="#0f172a"/>

                    <rect x="42" y="65" width="6" height="6" fill="#0f172a"/>
                    <rect x="52" y="65" width="6" height="6" fill="#0f172a"/>
                    <rect x="42" y="78" width="6" height="6" fill="#0f172a"/>
                    <rect x="52" y="78" width="6" height="6" fill="#0f172a"/>
                    <rect x="65" y="75" width="20" height="15" fill="#0f172a"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Scan at Barrier
                </span>
              </div>

              {/* Pass Main Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Parking Facility</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{lot.name}</div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{lot.address}, {lot.city}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Reserved Bay</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                    Bay {selectedSlot?.slotNumber}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{vehicleType} Category</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Vehicle Plate</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                    {vehicleNumber || user?.vehicleNumber || 'UP 32 EA 4455'}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Driver: {user?.name || 'Commuter'}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Schedule Window</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                    {bookingDate}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{startTimeStr} – {endTimeStr} ({durationHours}h)</span>
                </div>
              </div>
            </div>

            {/* Payment Audit Footer inside Pass */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Txn Ref: </span>
                <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>
                  {paymentResult?.transactionId || `PE-DEMO-${getTodayDateStr().replace(/-/g, '')}-8899`}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.72rem' }}>
                  PAID ₹{createdBooking?.totalPrice || totalPrice}
                </span>
                <span style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.72rem' }}>
                  CONFIRMED
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <Printer size={16} />
              <span>Print / Download Pass</span>
            </button>

            <Link
              to={`/bookings/${createdBooking?.id}`}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <QrCode size={16} />
              <span>View Pass Details</span>
            </Link>

            <Link
              to="/my-bookings"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}
            >
              <span>Go to My Bookings</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-parking-pass, #printable-parking-pass * {
            visibility: visible;
          }
          #printable-parking-pass {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 1px solid #000 !important;
            box-shadow: none !important;
          }
          .desktop-user-sidebar, header, nav, button, a {
            display: none !important;
          }
        }
        @media (max-width: 650px) {
          .pass-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReservationPage;
