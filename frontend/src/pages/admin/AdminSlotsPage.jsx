import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Grid3X3, Search, CheckCircle2, XCircle, RefreshCw, Car, Zap } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminSlotsPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getParkingSlots();
      setSlots(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSlots = slots.filter((s) => {
    const matchSearch =
      s.slotNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.parkingLotName?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase());
    const matchVehicle = vehicleFilter === 'ALL' || s.vehicleType?.toUpperCase() === vehicleFilter;
    return matchSearch && matchVehicle;
  });

  if (loading) return <LoadingSpinner text="Aggregating all system parking slots..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            System-Wide Parking Slots
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Inventory of all individual parking bays, tariffs, vehicle compatibilities, and states.
          </p>
        </div>

        <button onClick={fetchSlots} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Filters & Search */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search bay number, facility name, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-input" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
            <option value="ALL">All Vehicle Types</option>
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
            <option value="SUV">SUV</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Slot Number</th>
                <th style={{ padding: '0.85rem 1rem' }}>Parking Facility</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                <th style={{ padding: '0.85rem 1rem' }}>Vehicle Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Tariff (₹/hr)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlots.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', background: '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      {s.slotNumber}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                    {s.parkingLotName}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                    {s.city}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#334155' }}>
                    {s.vehicleType}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{s.pricePerHour}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${s.status === 'AVAILABLE' ? 'badge-success' : s.status === 'OCCUPIED' ? 'badge-warning' : 'badge-neutral'}`}>
                      {s.status}
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

export default AdminSlotsPage;
