import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import { paymentApi } from '../../api/paymentApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  Building2, 
  MapPin, 
  Car, 
  Calendar, 
  Clock, 
  CreditCard, 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Share2,
  Info
} from 'lucide-react';

const ParkingTicketPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [bookingRes, paymentRes] = await Promise.all([
          bookingApi.getBookingById(id).catch(() => bookingApi.verifyBooking(id)),
          paymentApi.getPaymentByBookingId(id).catch(() => null),
        ]);

        setBooking(bookingRes.data);
        if (paymentRes?.data) {
          setPayment(paymentRes.data);
        }
      } catch (err) {
        console.error('Failed to load parking ticket:', err);
        setError(err.response?.data?.message || 'Unable to load parking pass.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [id]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', maxWidth: '750px', margin: '0 auto' }}>
        <LoadingSpinner text="Retrieving digital parking pass..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <ErrorMessage message={error || 'Parking ticket not found.'} />
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/my-bookings" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Go to My Bookings</span>
          </Link>
        </div>
      </div>
    );
  }

  const bookingRef = `PE-${new Date(booking.createdAt || Date.now()).getFullYear()}${String(new Date(booking.createdAt || Date.now()).getMonth() + 1).padStart(2, '0')}${String(new Date(booking.createdAt || Date.now()).getDate()).padStart(2, '0')}-${String(booking.id).padStart(6, '0')}`;

  return (
    <div className="container ticket-page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link
          to={`/bookings/${booking.id}`}
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
          <span>Back to Booking Details</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Ticket Card */}
      <div
        id="printable-parking-ticket"
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '2px solid #e2e8f0',
          padding: '2.25rem',
          boxShadow: '0 6px 25px rgba(0,0,0,0.06)',
          position: 'relative'
        }}
      >
        {/* Pass Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.35rem', borderRadius: '8px' }}>
                <Car size={20} />
              </div>
              <span>Park<span style={{ color: 'var(--primary)' }}>Ease</span> Pass</span>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Guaranteed Entry Token
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Pass Identifier
            </span>
            <strong style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary)' }}>
              {bookingRef}
            </strong>
          </div>
        </div>

        {/* QR & Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '2rem', alignItems: 'center', marginBottom: '1.75rem' }} className="ticket-body-grid">
          
          {/* QR Box */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ background: '#ffffff', padding: '0.6rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '0.5rem' }}>
              <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Scan at Barrier
            </span>
          </div>

          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Facility Name</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{booking.parkingLotName}</div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.parkingLotAddress}, {booking.parkingLotCity}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Reserved Bay</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>
                Slot {booking.slotNumber}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.vehicleType} Slot</span>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Vehicle Plate</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                {booking.vehicleNumber || 'Registered Commuter'}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Driver: {booking.userName}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Valid Window</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                {formatDateTime(booking.startTime)}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>to {formatDateTime(booking.endTime)}</span>
            </div>
          </div>
        </div>

        {/* Security / Instructions Bar */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.82rem' }}>
            <Info size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>Show this digital pass at the entrance boom barrier. Plate number recognition will verify access.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
              PAID ₹{booking.totalPrice}
            </span>
            <span style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
              {booking.status}
            </span>
          </div>
        </div>

        {payment && (
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', textAlign: 'center' }}>
            Payment Transaction Reference: <span style={{ fontFamily: 'monospace' }}>{payment.transactionId}</span> • Demo Gateway Settlement
          </div>
        )}
      </div>

      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-parking-ticket, #printable-parking-ticket * {
            visibility: visible;
          }
          #printable-parking-ticket {
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
          .ticket-body-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ParkingTicketPage;
