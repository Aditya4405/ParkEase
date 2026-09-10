import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../api/bookingApi';
import SkeletonLoader, { TableSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Calendar, Search, Filter, MapPin, Car, Phone, CreditCard } from 'lucide-react';

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.getOwnerBookings();
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

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch = !searchTerm.trim() || 
      b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.parkingLotName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
            🇮🇳 Operator Reservation Logs
          </span>
        </div>
        <h1 className="page-title">
          <Calendar size={28} style={{ color: 'var(--primary)' }} />
          Driver Reservations & Tariff Logs
        </h1>
        <p className="page-subtitle">Track and inspect all parking bookings and earnings across your Indian facilities.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={17} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by driver name, vehicle plate, lot, or bay..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.3rem' }}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Reservation Statuses</option>
              <option value="RESERVED">Confirmed (Reserved)</option>
              <option value="ACTIVE">Active Now</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing {filteredBookings.length} records
          </div>
        </div>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {loading ? (
        <TableSkeleton rows={5} cols={8} />
      ) : filteredBookings.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pass #</th>
                <th>Driver Details</th>
                <th>Facility & Bay</th>
                <th>Vehicle Plate</th>
                <th>Reserved Period</th>
                <th>Rate (₹/hr)</th>
                <th>Total Tariff (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>#PK-{String(b.id).padStart(5, '0')}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{b.userName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                    {b.userPhone && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={11} /> {b.userPhone}
                      </div>
                    )}
                  </td>
                  <td>
                    <div><strong>{b.parkingLotName}</strong></div>
                    <small style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      Bay: {b.slotNumber} ({b.slotSize} {b.vehicleType})
                    </small>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      <Car size={13} /> {b.vehicleNumber || 'UP 32 EA 4455'}
                    </span>
                  </td>
                  <td>
                    <small style={{ display: 'block' }}>
                      {new Date(b.startTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </small>
                    <small style={{ color: 'var(--text-muted)' }}>
                      to {new Date(b.endTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </small>
                  </td>
                  <td>
                    <div>₹{b.pricePerHour ? Number(b.pricePerHour).toFixed(0) : '40'}/hr</div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: b.status === 'CANCELLED' ? 'var(--text-muted)' : '#059669' }}>
                      ₹{b.totalPrice ? Number(b.totalPrice).toFixed(0) : '0'}
                    </strong>
                  </td>
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
      ) : (
        <EmptyState
          title="No Reservations Found"
          description="No customer reservations matched your search query or filter criteria."
        />
      )}
    </div>
  );
};

export default OwnerBookingsPage;
