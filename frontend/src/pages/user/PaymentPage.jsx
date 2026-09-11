import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import { paymentApi } from '../../api/paymentApi';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Car, 
  AlertCircle,
  ArrowRight,
  Receipt
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [existingPayment, setExistingPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    fetchBookingAndPayment();
  }, [bookingId]);

  const fetchBookingAndPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookingRes = await bookingApi.getBookingById(bookingId);
      setBooking(bookingRes.data);

      try {
        const paymentRes = await paymentApi.getPaymentByBookingId(bookingId);
        if (paymentRes.data) {
          setExistingPayment(paymentRes.data);
          if (paymentRes.data.status === 'SUCCESS') {
            setPaymentSuccess(paymentRes.data);
          }
        }
      } catch (err) {
        // Payment might not exist yet if pending
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const response = await paymentApi.processPayment({
        bookingId: parseInt(bookingId),
        paymentMethod: paymentMethod
      });
      setPaymentSuccess(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving reservation details..." />;
  }

  if (error && !booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <ErrorMessage error={error} onDismiss={() => setError(null)} />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/my-bookings" className="btn btn-secondary">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  // If already paid or just paid successfully
  if (paymentSuccess) {
    return (
      <div style={{ maxWidth: '650px', margin: '2rem auto' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--success-subtle)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 15px rgba(22, 101, 52, 0.15)'
          }}>
            <CheckCircle2 size={40} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Payment Successful!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Your parking slot reservation is confirmed. A digital parking pass has been generated.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Booking ID</span>
              <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>PE-BK-{booking?.id}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Transaction ID</span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{paymentSuccess.transactionId}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Parking Facility</span>
              <strong style={{ color: '#0f172a' }}>{booking?.parkingLotName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Assigned Slot</span>
              <span style={{ fontWeight: 800, color: 'var(--primary)', background: '#e0e7ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                {booking?.slotNumber} ({booking?.vehicleType})
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Payment Method</span>
              <strong style={{ color: '#0f172a' }}>{paymentSuccess.paymentMethod} (Prototype Gateway)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>Total Paid</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>₹{paymentSuccess.amount || booking?.totalPrice}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={`/bookings/${bookingId}`} className="btn btn-primary">
              <Receipt size={16} />
              <span>View Booking Pass</span>
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Confirm & Pay Reservation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Review your reservation breakdown and complete payment to confirm your guaranteed parking slot.
        </p>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Booking Summary */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Car size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Reservation Summary</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>PARKING FACILITY</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{booking?.parkingLotName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                <MapPin size={14} />
                <span>{booking?.city}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SLOT</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{booking?.slotNumber}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>VEHICLE</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{booking?.vehicleType}</div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>SCHEDULE</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 600, fontSize: '0.92rem', marginTop: '0.2rem' }}>
                <Clock size={15} color="var(--primary)" />
                <span>{new Date(booking?.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1.4rem' }}>
                to {new Date(booking?.endTime).toLocaleString('en-IN', { timeStyle: 'short' })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Amount Payable</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>₹{booking?.totalPrice}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                Includes all applicable GST & municipal parking fees
              </span>
            </div>
          </div>
        </div>

        {/* Right: Payment Method Form */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <CreditCard size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Select Payment Mode</h3>
          </div>

          <div style={{
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.82rem',
            color: '#0369a1',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>Prototype Sandbox Mode: Simulated instant settlement. No real bank charges.</span>
          </div>

          <form onSubmit={handleProcessPayment}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: paymentMethod === 'UPI' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: paymentMethod === 'UPI' ? 'var(--primary)' : '#475569'
                }}
              >
                <Smartphone size={20} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  border: paymentMethod === 'CARD' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: paymentMethod === 'CARD' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: paymentMethod === 'CARD' ? 'var(--primary)' : '#475569'
                }}
              >
                <CreditCard size={20} />
                <span>Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('WALLET')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  border: paymentMethod === 'WALLET' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: paymentMethod === 'WALLET' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: paymentMethod === 'WALLET' ? 'var(--primary)' : '#475569'
                }}
              >
                <Wallet size={20} />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Dynamic Inputs */}
            {paymentMethod === 'UPI' && (
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. mobile@okaxis, driver@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.35rem' }}>
                  Supports Google Pay, PhonePe, Paytm, BHIM UPI
                </span>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Aditya Sharma"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="4532 •••• •••• 8892"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label className="form-label">MM/YY</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="08/29"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="•••"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'WALLET' && (
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Select Bank</label>
                <select className="form-input">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800 }}
              disabled={processing}
            >
              {processing ? <LoadingSpinner text="Authorizing Payment..." /> : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span>Pay ₹{booking?.totalPrice} & Confirm</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
