import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Briefcase, Building2, Search, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminOwnersPage = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getOwners();
      setOwners(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    setActionLoadingId(id);
    try {
      const response = await adminApi.toggleUserStatus(id);
      setOwners(owners.map((o) => (o.id === id ? response.data : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update operator status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOwners = owners.filter((o) =>
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.phone?.includes(search)
  );

  if (loading) return <LoadingSpinner text="Loading parking facility operators..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Parking Operators & Facility Partners
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Manage verified parking facility owners, concessionaires, and authorized operators.
          </p>
        </div>

        <button onClick={fetchOwners} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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
            placeholder="Search operator name, email, or contact number..."
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
                <th style={{ padding: '0.85rem 1rem' }}>Partner ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Operator / Contact</th>
                <th style={{ padding: '0.85rem 1rem' }}>Official Email</th>
                <th style={{ padding: '0.85rem 1rem' }}>Phone (India)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                    #OWN-{o.id}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ color: '#0f172a' }}>{o.name}</strong>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                    {o.email}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                    {o.phone || '+91 98765 43210'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${o.active ? 'badge-success' : 'badge-neutral'}`}>
                      {o.active ? 'Active Partner' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(o.id)}
                      disabled={actionLoadingId === o.id}
                      className={`btn btn-sm ${o.active ? 'btn-danger-outline' : 'btn-success'}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      {actionLoadingId === o.id ? '...' : o.active ? 'Deactivate' : 'Activate'}
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

export default AdminOwnersPage;
