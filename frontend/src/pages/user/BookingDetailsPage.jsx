import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import { paymentApi } from '../../api/paymentApi';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Receipt, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Printer,
  ShieldCheck
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchBookingData();
  }, [id]);

  const fetchBookingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingApi.getBookingById(id);
      setBooking(response.data);

      try {
        const payRes = await paymentApi.getPaymentByBookingId(id);
        if (payRes.data) {
          setPayment(payRes.data);
        }
      } catch (err) {
        // payment record might not exist yet
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelling(true);
    setError(null);
    try {
      const response = await bookingApi.cancelBooking(id);
      setBooking(response.data);
      setSuccessMsg('Booking has been cancelled successfully.');
    } catch (err) {
      setError(err);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return <span className="badge badge-success"><CheckCircle2 size={13} /> {status}</span>;
      case 'RESERVED':
        return <span className="badge badge-info"><Clock size={13} /> RESERVED</span>;
      case 'COMPLETED':
        return <span className="badge badge-secondary"><CheckCircle2 size={13} /> COMPLETED</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger"><XCircle size={13} /> CANCELLED</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return <span className="badge badge-success"><ShieldCheck size={13} /> PAID</span>;
      case 'PENDING':
        return <span className="badge badge-warning"><Clock size={13} /> PENDING</span>;
      case 'REFUNDED':
        return <span className="badge badge-info">REFUNDED</span>;
      case 'FAILED':
        return <span className="badge badge-danger">FAILED</span>;
      default:
        return <span className="badge badge-secondary">{status || 'PENDING'}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading reservation pass..." />;
  }

  if (error && !booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <ErrorMessage error={error} onDismiss={() => setError(null)} />
        <Link to="/my-bookings" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to My Bookings
        </Link>
      </div>
    );
  }

  const isCancellable = booking?.status === 'RESERVED' || booking?.status === 'CONFIRMED';
  const isPendingPayment = (!payment || payment.status === 'PENDING') && booking?.status !== 'CANCELLED';

  return (
    <div style={{ maxWidth: '750px', margin: '1rem auto' }}>
      {/* Back button & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/my-bookings" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={14} />
          <span>All Bookings</span>
        </Link>
        <button 
          onClick={() => window.print()}
          className="btn btn-secondary btn-sm" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Printer size={14} />
          <span>Print Pass</span>
        </button>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--success-subtle)', color: 'var(--success)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600 }}>
          {successMsg}
        </div>
      )}

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Main Pass Card */}
      <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
        {/* Pass Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              OFFICIAL PARKING PASS
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
              Pass #PE-BK-{booking?.id}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Booked on {new Date(booking?.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            {getStatusBadge(booking?.status)}
            {getPaymentBadge(payment?.status || (booking?.status === 'CONFIRMED' ? 'SUCCESS' : 'PENDING'))}
          </div>
        </div>

        {/* Facility Info */}
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.6rem', borderRadius: '10px' }}>
              <Car size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {booking?.parkingLotName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                <MapPin size={15} />
                <span>{booking?.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Assigned Slot</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.25rem' }}>
              {booking?.slotNumber}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Vehicle: {booking?.vehicleType}</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Vehicle Reg.</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
              {booking?.vehicleNumber || 'Registered Commuter'}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Driver: {booking?.userName}</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Entry Window Start</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--primary)" />
              <span>{new Date(booking?.startTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Exit Window End</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="#64748b" />
              <span>{new Date(booking?.endTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Base Parking Tariff</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{booking?.totalPrice}</span>
          </div>
          {payment && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Transaction Reference</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '0.85rem' }}>{payment.transactionId}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>Total Amount</strong>
            <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>₹{booking?.totalPrice}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          {isPendingPayment && (
            <Link to={`/payment/${booking.id}`} className="btn btn-primary">
              <CreditCard size={16} />
              <span>Complete Payment (₹{booking.totalPrice})</span>
            </Link>
          )}

          {isCancellable && (
            <button
              onClick={handleCancelBooking}
              className="btn btn-danger"
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
