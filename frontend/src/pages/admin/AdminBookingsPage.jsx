import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Calendar, Search, RefreshCw, Car, CheckCircle2, Clock, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.userName?.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.parkingLotName?.toLowerCase().includes(search.toLowerCase()) ||
      b.slotNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <LoadingSpinner text="Aggregating platform-wide booking registry..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Platform Booking Logs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Auditable trail of all commuter reservations, active parking sessions, and history.
          </p>
        </div>

        <button onClick={fetchBookings} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Search & Filter */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search driver, email, facility, plate, bay..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="RESERVED">Reserved</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Booking ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Driver / Commuter</th>
                <th style={{ padding: '0.85rem 1rem' }}>Facility & Slot</th>
                <th style={{ padding: '0.85rem 1rem' }}>Vehicle</th>
                <th style={{ padding: '0.85rem 1rem' }}>Schedule</th>
                <th style={{ padding: '0.85rem 1rem' }}>Tariff (₹)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                    #PE-BK-{b.id}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{b.userName}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.userEmail}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{b.parkingLotName}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>Bay: {b.slotNumber}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {b.vehicleNumber || 'UP 32 EA 4455'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#334155' }}>
                    <div>{new Date(b.startTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    <div style={{ color: '#64748b' }}>to {new Date(b.endTime).toLocaleString('en-IN', { timeStyle: 'short' })}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{b.totalPrice}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
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

export default AdminBookingsPage;
