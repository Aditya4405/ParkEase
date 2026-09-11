import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Building2, MapPin, Search, CheckCircle2, XCircle, RefreshCw, Zap, Layers } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminParkingPage = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getParkingLots();
      setLots(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    setActionLoadingId(id);
    try {
      const response = await adminApi.toggleParkingLotStatus(id);
      setLots(lots.map((l) => (l.id === id ? response.data : l)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update facility status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredLots = lots.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.city?.toLowerCase().includes(search.toLowerCase()) ||
    l.address?.toLowerCase().includes(search.toLowerCase()) ||
    l.ownerName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading system-wide parking facilities..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Parking Facilities Oversight
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            All registered multi-level, open, and basement parking lots across India.
          </p>
        </div>

        <button onClick={fetchParkingLots} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Search */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search parking name, city, landmark, or operator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Facility Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location / City</th>
                <th style={{ padding: '0.85rem 1rem' }}>Operator</th>
                <th style={{ padding: '0.85rem 1rem' }}>Bays Capacity</th>
                <th style={{ padding: '0.85rem 1rem' }}>Features</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{l.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{l.parkingType || 'Commercial Parking'}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#334155' }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span>{l.city}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{l.address}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#334155' }}>
                    {l.ownerName || 'Verified Partner'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{l.totalSlots || l.totalCapacity || 0}</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({l.availableSlots || 0} free)</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {(l.hasEVCharging || l.evCharging) && (
                      <span className="badge badge-success" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Zap size={11} /> EV Ready
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${l.active ? 'badge-success' : 'badge-neutral'}`}>
                      {l.active ? 'Operational' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(l.id)}
                      disabled={actionLoadingId === l.id}
                      className={`btn btn-sm ${l.active ? 'btn-danger-outline' : 'btn-success'}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      {actionLoadingId === l.id ? '...' : l.active ? 'Deactivate' : 'Activate'}
                    </button>
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

export default AdminParkingPage;
