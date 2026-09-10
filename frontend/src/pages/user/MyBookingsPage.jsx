import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import BookingCard from '../../components/booking/BookingCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Calendar, Search, ArrowRight, Filter, ShieldCheck } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? Full refund will be processed.')) return;
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

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const tabCounts = {
    ALL: bookings.length,
    RESERVED: bookings.filter((b) => b.status === 'RESERVED').length,
    ACTIVE: bookings.filter((b) => b.status === 'ACTIVE').length,
    COMPLETED: bookings.filter((b) => b.status === 'COMPLETED').length,
    CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length,
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
              🇮🇳 Digital Parking Passes
            </span>
          </div>
          <h1 className="page-title">
            <Calendar size={28} style={{ color: 'var(--primary)' }} />
            My Bookings & Passes
          </h1>
          <p className="page-subtitle">
            View active reservations, download e-slips, or cancel bookings.
          </p>
        </div>

        <Link to="/parking-lots" className="btn btn-primary">
          <Search size={16} />
          <span>Book Another Bay</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { key: 'ALL', label: 'All Passes' },
          { key: 'RESERVED', label: 'Confirmed' },
          { key: 'ACTIVE', label: 'Active Now' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.key ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                color: activeTab === tab.key ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.72rem',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
              }}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {loading ? (
        <SkeletonLoader count={4} />
      ) : filteredBookings.length > 0 ? (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
              cancellingId={cancellingId}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={activeTab === 'ALL' ? 'No Bookings Yet' : `No ${activeTab.toLowerCase()} bookings found`}
          description={
            activeTab === 'ALL'
              ? "You haven't made any parking reservations yet. Explore nearby facilities in Lucknow or Delhi NCR."
              : `You have no bookings marked as ${activeTab.toLowerCase()} right now.`
          }
          actionText="Find & Reserve Parking"
          actionLink="/parking-lots"
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
