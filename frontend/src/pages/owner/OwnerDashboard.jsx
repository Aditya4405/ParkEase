import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { parkingApi } from '../../api/parkingApi';
import { bookingApi } from '../../api/bookingApi';
import SkeletonLoader, { TableSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  Building2, 
  Layers, 
  Calendar, 
  PlusCircle, 
  ArrowRight, 
  MapPin, 
  CheckCircle, 
  Activity,
  CreditCard,
  Zap
} from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotsRes, bookingsRes] = await Promise.all([
          parkingApi.getMyParkingLots(),
          bookingApi.getOwnerBookings()
        ]);
        setLots(lotsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <SkeletonLoader count={4} />;

  const totalSlots = lots.reduce((acc, lot) => acc + (lot.totalSlots || 0), 0);
  const totalAvailableSlots = lots.reduce((acc, lot) => acc + (lot.availableSlots || 0), 0);
  const activeBookings = bookings.filter(b => b.status === 'RESERVED' || b.status === 'ACTIVE');
  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
              🇮🇳 Owner & Operator Console
            </span>
          </div>
          <h1 className="page-title">
            Facility Manager – {user?.name}
          </h1>
          <p className="page-subtitle">
            Manage your commercial parking facilities, slot pricing in INR (₹), and monitor live occupancy.
          </p>
        </div>
        <Link to="/owner/create-lot" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>List New Facility</span>
        </Link>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Stats Cards in INR */}
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
            <Building2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Facilities
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>{lots.length}</h3>
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
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Bay Slots
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>{totalSlots}</h3>
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
            <Calendar size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Bookings
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>{activeBookings.length}</h3>
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
              Gross Revenue (₹)
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 800 }}>₹{totalRevenue.toFixed(0)}</h3>
          </div>
        </div>
      </div>

      {/* Facilities Quick View */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>My Facilities (Lucknow & UP)</h2>
          <Link to="/owner/lots" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Manage All Lots ({lots.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {lots.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Facility Name</th>
                  <th>Location / City</th>
                  <th>Total Bays</th>
                  <th>Vacant Bays</th>
                  <th>Tariff Base</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id}>
                    <td>
                      <strong style={{ fontSize: '0.95rem' }}>{lot.name}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <MapPin size={14} />
                        <span>{lot.city}, {lot.pincode}</span>
                      </div>
                    </td>
                    <td><strong>{lot.totalSlots}</strong></td>
                    <td>
                      <span className={`status-pill ${lot.availableSlots > 5 ? 'available' : lot.availableSlots > 0 ? 'limited' : 'full'}`} style={{ fontSize: '0.72rem' }}>
                        <span className="status-indicator-dot" />
                        {lot.availableSlots} Vacant
                      </span>
                    </td>
                    <td><strong>₹{lot.startingPrice ? Number(lot.startingPrice).toFixed(0) : '30'}/hr</strong></td>
                    <td>
                      <span className={`badge ${lot.active ? 'badge-success' : 'badge-neutral'}`}>
                        {lot.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/owner/lots/${lot.id}/slots`} className="btn btn-secondary btn-sm">
                          Configure Slots
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Parking Facilities Listed"
            description="Add your first parking lot in Lucknow, Delhi NCR, or any Indian city to start earning."
            actionText="Create Parking Facility"
            actionLink="/owner/create-lot"
          />
        )}
      </div>

      {/* Customer Reservations Quick View */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Recent Driver Reservations</h2>
          <Link to="/owner/bookings" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>All Bookings ({bookings.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Driver</th>
                  <th>Facility & Slot</th>
                  <th>Vehicle Number</th>
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
                      <small style={{ color: 'var(--primary)', fontWeight: 700 }}>Bay: {b.slotNumber} ({b.slotSize})</small>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                        {b.vehicleNumber || 'UP 32 EA 4455'}
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
        ) : (
          <EmptyState
            title="No Bookings Recorded"
            description="When drivers reserve spots at your facilities, bookings and tariff logs will appear here."
          />
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
