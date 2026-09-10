import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../api/bookingApi';
import { parkingApi } from '../../api/parkingApi';
import BookingCard from '../../components/booking/BookingCard';
import ParkingLotCard from '../../components/parking/ParkingLotCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Compass,
  QrCode,
  CreditCard,
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [nearbyLots, setNearbyLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, lotsRes] = await Promise.all([
          bookingApi.getMyBookings(),
          parkingApi.searchParkingLots({ city: 'Lucknow' }),
        ]);
        setBookings(bookingsRes.data);
        setNearbyLots(lotsRes.data.slice(0, 3));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? Full refund policy applies.')) return;
    setCancellingId(bookingId);
    try {
      const res = await bookingApi.cancelBooking(bookingId);
      setBookings(bookings.map((b) => (b.id === bookingId ? res.data : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <SkeletonLoader count={3} />;

  const activeBookings = bookings.filter((b) => b.status === 'RESERVED' || b.status === 'ACTIVE');
  const pastBookings = bookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED');
  const totalSpent = bookings.reduce((sum, b) => (b.status === 'COMPLETED' || b.status === 'RESERVED' ? sum + (b.totalPrice || 0) : sum), 0);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      {/* Header with Indian Welcome */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
              🇮🇳 Driver Account
            </span>
          </div>
          <h1 className="page-title">
            Welcome back, {user?.name || 'Driver'}!
          </h1>
          <p className="page-subtitle">
            Manage your active parking reservations across Lucknow, Delhi NCR and top Indian hubs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/parking-lots" className="btn btn-primary">
            <Compass size={16} />
            <span>Find Nearby Parking</span>
          </Link>
        </div>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Stats Cards in Indian Currency */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Bookings
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{activeBookings.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Completed Trips
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              {bookings.filter((b) => b.status === 'COMPLETED').length}
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CreditCard size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Tariff Spent
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              ₹{Number(totalSpent).toFixed(0)}
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Car size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Primary Vehicle
            </span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '2px' }}>
              {user?.vehicleNumber || 'UP 32 EA 4455'}
            </h3>
          </div>
        </div>
      </div>

      {/* Active Reservations Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Upcoming & Active Reservations</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Present your digital pass QR code at the entrance barrier.
            </p>
          </div>

          <Link to="/my-bookings" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>All Bookings ({bookings.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {activeBookings.length > 0 ? (
          <div className="grid-2">
            {activeBookings.map((b) => (
              <BookingCard 
                key={b.id} 
                booking={b} 
                onCancel={handleCancelBooking} 
                cancellingId={cancellingId} 
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Active Reservations"
            description="You don't have any upcoming parking bookings right now. Search a destination in Lucknow or Delhi NCR to reserve a slot."
            actionText="Find Nearby Parking"
            actionLink="/parking-lots"
          />
        )}
      </div>

      {/* Recommended Parking Facilities in Lucknow */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Popular Parking in Lucknow</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Verified parking hubs near Phoenix Palassio, Charbagh Station & Hazratganj.
            </p>
          </div>

          <Link to="/parking-lots?city=Lucknow" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Explore All Hubs</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid-3">
          {nearbyLots.map((lot) => (
            <ParkingLotCard key={lot.id} lot={lot} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
