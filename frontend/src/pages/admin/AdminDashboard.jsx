import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { parkingApi } from '../../api/parkingApi';
import { bookingApi } from '../../api/bookingApi';
import SkeletonLoader, { TableSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Layers, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  UserCheck,
  Activity,
  CreditCard,
  Car
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lots, setLots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, lotsRes, bookingsRes, usersRes] = await Promise.all([
          userApi.getSystemStats(),
          parkingApi.searchParkingLots(),
          bookingApi.getAllBookings(),
          userApi.getAllUsers()
        ]);
        setStats(statsRes.data);
        setLots(lotsRes.data);
        setBookings(bookingsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <SkeletonLoader count={4} />;

  const totalSlots = lots.reduce((acc, lot) => acc + (lot.totalSlots || 0), 0);
  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>
              🇮🇳 Master System Administration
            </span>
          </div>
          <h1 className="page-title">
            ParkEase India Command Center
          </h1>
          <p className="page-subtitle">Platform-wide health, user directories, facility management, and Indian booking oversight.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/users" className="btn btn-primary">
            <Users size={16} />
            <span>Manage All Users</span>
          </Link>
        </div>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* System Metric Cards in INR */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Registered Drivers
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Facility Operators
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>{stats?.totalOwners || 0}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Parking Bays
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>{totalSlots}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CreditCard size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Platform Volume (₹)
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>₹{totalRevenue.toFixed(0)}</h3>
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>System Accounts Directory</h2>
          <Link to="/admin/users" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Full User Management ({users.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Phone (India)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 6).map((u) => (
                <tr key={u.id}>
                  <td><strong>#USR-{u.id}</strong></td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'OWNER' ? 'badge-warning' : 'badge-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.phone || '+91 98765 43210'}</td>
                  <td>
                    <span className={`badge ${u.active ? 'badge-success' : 'badge-neutral'}`}>
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Bookings Overview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Recent Platform Reservations</h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Total {bookings.length} reservations across Indian cities
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking Pass</th>
                <th>Driver</th>
                <th>Facility & Bay</th>
                <th>Vehicle Plate</th>
                <th>Schedule</th>
                <th>Tariff (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id}>
                  <td><strong>#PK-{String(b.id).padStart(5, '0')}</strong></td>
                  <td>
                    <div>{b.userName}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{b.userEmail}</small>
                  </td>
                  <td>
                    <div>{b.parkingLotName}</div>
                    <small style={{ color: 'var(--primary)', fontWeight: 700 }}>Slot: {b.slotNumber}</small>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      <Car size={13} /> {b.vehicleNumber || 'UP 32 EA 4455'}
                    </span>
                  </td>
                  <td>
                    <small style={{ display: 'block' }}>{new Date(b.startTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</small>
                    <small style={{ color: 'var(--text-muted)' }}>to {new Date(b.endTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</small>
                  </td>
                  <td><strong style={{ color: 'var(--primary)' }}>₹{b.totalPrice ? Number(b.totalPrice).toFixed(0) : '0'}</strong></td>
                  <td>
                    <span className={`badge ${
                      b.status === 'RESERVED' ? 'badge-primary' :
                      b.status === 'ACTIVE' ? 'badge-success' :
                      b.status === 'COMPLETED' ? 'badge-neutral' : 'badge-danger'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
