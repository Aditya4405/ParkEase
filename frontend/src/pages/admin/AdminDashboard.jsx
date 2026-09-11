import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Grid3X3, 
  CreditCard, 
  Calendar, 
  ArrowRight,
  UserCheck,
  TrendingUp,
  Activity,
  Layers,
  Car,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, bookingsRes, usersRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getBookings(),
        adminApi.getUsers()
      ]);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data ? bookingsRes.data.slice(0, 6) : []);
      setRecentUsers(usersRes.data ? usersRes.data.slice(0, 6) : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonLoader count={4} />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800 }}>
              ROOT CONTROL TOWER
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Master Administration Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Real-time platform overview, user and facility metrics, and booking logs.
          </p>
        </div>

        <button onClick={fetchDashboardData} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Pending Partner Applications Alert Banner */}
      {(stats?.pendingOwnerApplications > 0) && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1px solid #fde68a',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#f59e0b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900
            }}>
              <Briefcase size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: '#92400e', display: 'block' }}>
                {stats.pendingOwnerApplications} Partner Application{stats.pendingOwnerApplications > 1 ? 's' : ''} Awaiting Verification
              </strong>
              <span style={{ fontSize: '0.84rem', color: '#b45309' }}>
                New facility operators have submitted their ownership & facility specs for review.
              </span>
            </div>
          </div>
          <Link
            to="/admin/owner-applications"
            className="btn btn-primary"
            style={{
              background: '#d97706',
              borderColor: '#d97706',
              padding: '0.6rem 1.25rem',
              fontSize: '0.86rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Review Applications</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Metrics Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Partner Applications</span>
            <Briefcase size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#92400e' }}>
            {stats?.pendingOwnerApplications || 0}
          </div>
          <Link to="/admin/owner-applications" style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <span>Review pipeline</span> <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Registered Drivers</span>
            <Users size={20} color="#4f46e5" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            {stats?.totalUsers || 0}
          </div>
          <Link to="/admin/users" style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <span>Manage accounts</span> <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Facility Partners</span>
            <Building2 size={20} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            {stats?.totalOwners || 0}
          </div>
          <Link to="/admin/owners" style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <span>Manage operators</span> <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Parking Locations</span>
            <Layers size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            {stats?.totalParkingLots || 0}
          </div>
          <Link to="/admin/parking" style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <span>View facilities</span> <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Revenue</span>
            <CreditCard size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            ₹{stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString('en-IN') : '0'}
          </div>
          <Link to="/admin/payments" style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
            <span>Audit transactions</span> <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Metrics Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Parking Bays</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {stats?.totalSlots || 0} Slots
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Available Bays Now</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
            {stats?.availableSlots || 0} Free
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Bookings</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {stats?.totalBookings || 0} Reservations
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Paid Transactions</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
            {stats?.successfulPayments || 0} Settled
          </div>
        </div>
      </div>

      {/* Grid: Recent Bookings & Registered Accounts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Reservations */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Recent Reservations
            </h3>
            <Link to="/admin/bookings" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentBookings.map((b) => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{b.userName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.parkingLotName} • Slot {b.slotNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{b.totalPrice}</div>
                  <span className={`badge ${b.status === 'RESERVED' ? 'badge-primary' : b.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.68rem' }}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registered Accounts */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Newly Registered Users
            </h3>
            <Link to="/admin/users" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentUsers.map((u) => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                </div>
                <div>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'OWNER' ? 'badge-warning' : 'badge-primary'}`}>
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
