import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  Search, 
  CalendarCheck, 
  Clock, 
  Car, 
  ArrowRight, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  TrendingUp,
  User,
  QrCode
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/dashboard-stats');
      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load user dashboard stats:', err);
      setError('Unable to load latest dashboard telemetry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        borderRadius: '20px',
        padding: '2.25rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px rgba(49, 46, 129, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.5px' }}>
            Welcome Back
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0 0.5rem', letterSpacing: '-0.5px' }}>
            Hello, {user?.name || 'Commuter'} 👋
          </h1>
          <p style={{ color: '#c7d2fe', fontSize: '0.92rem', margin: 0, maxWidth: '480px', lineHeight: '1.5' }}>
            Ready to park smarter? Discover parking near your destination and manage your active reservations seamlessly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/find-parking"
            className="btn btn-primary"
            style={{
              background: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              padding: '0.75rem 1.4rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <Search size={16} />
            <span>Find Parking</span>
          </Link>
          <Link
            to="/my-bookings"
            className="btn btn-secondary"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: '10px'
            }}
          >
            My Bookings
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Bookings
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '0.3rem' }}>
            {loading ? '...' : (stats?.totalBookings || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lifetime reservations</span>
        </div>

        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
            Upcoming / Active
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0284c7', marginTop: '0.3rem' }}>
            {loading ? '...' : (stats?.upcomingCount || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reserved spaces</span>
        </div>

        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
            Completed Sessions
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', marginTop: '0.3rem' }}>
            {loading ? '...' : (stats?.completedCount || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Successfully parked</span>
        </div>

        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            Total Spent
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.3rem' }}>
            ₹{loading ? '...' : (stats?.totalSpent?.toFixed(0) || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total booking expense</span>
        </div>
      </div>

      {/* Next Upcoming Booking Card */}
      {stats?.nextBooking && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginBottom: '2rem',
          borderLeft: '5px solid var(--primary)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{
                background: '#ecfdf5',
                color: '#047857',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                border: '1px solid #a7f3d0',
                textTransform: 'uppercase'
              }}>
                ● Next Upcoming Reservation
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0.4rem 0 0.2rem' }}>
                {stats.nextBooking.parkingLotName}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                <span>{stats.nextBooking.parkingLotAddress}, {stats.nextBooking.parkingLotCity}</span>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Pass Amount</span>
              <strong style={{ fontSize: '1.35rem', color: 'var(--primary)', fontWeight: 900 }}>
                ₹{stats.nextBooking.totalPrice}
              </strong>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '12px',
            marginTop: '1.25rem',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Slot & Vehicle</span>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                Slot {stats.nextBooking.slotNumber} ({stats.nextBooking.vehicleType})
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Vehicle Plate</span>
              <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                {stats.nextBooking.vehicleNumber || 'Registered Vehicle'}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Time Window</span>
              <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>
                {formatDateTime(stats.nextBooking.startTime)}
              </strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Link
                to={`/bookings/${stats.nextBooking.id}`}
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <QrCode size={14} />
                <span>View Digital Pass</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings List */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Recent Reservations
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Latest activity on your account</span>
          </div>
          <Link to="/my-bookings" style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>Loading bookings telemetry...</div>
        ) : (!stats?.recentBookings || stats.recentBookings.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <Car size={36} style={{ color: '#94a3b8', margin: '0 auto 0.6rem' }} />
            <strong style={{ fontSize: '0.98rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
              No Reservations Yet
            </strong>
            <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
              Search for parking near your destination and reserve your first space in advance.
            </p>
            <Link to="/find-parking" className="btn btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.86rem', fontWeight: 700 }}>
              Find Parking Near Destination
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem' }}>Parking Facility</th>
                  <th style={{ padding: '0.75rem' }}>Slot & Type</th>
                  <th style={{ padding: '0.75rem' }}>Booking Window</th>
                  <th style={{ padding: '0.75rem' }}>Tariff</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{b.parkingLotName}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{b.parkingLotCity}</span>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>Slot {b.slotNumber}</span>
                      <span style={{ display: 'block', fontSize: '0.74rem', color: '#64748b' }}>{b.vehicleType}</span>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: '#334155' }}>
                      {formatDateTime(b.startTime)}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{b.totalPrice}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: b.status === 'RESERVED' || b.status === 'ACTIVE' ? '#ecfdf5' : b.status === 'COMPLETED' ? '#f0f9ff' : '#fee2e2',
                        color: b.status === 'RESERVED' || b.status === 'ACTIVE' ? '#047857' : b.status === 'COMPLETED' ? '#0284c7' : '#991b1b',
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                      <Link
                        to={`/bookings/${b.id}`}
                        style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        View Pass →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserDashboard;
