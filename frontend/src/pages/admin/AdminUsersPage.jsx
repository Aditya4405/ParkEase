import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Users, Search, CheckCircle2, XCircle, ShieldCheck, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getUsers();
      setUsers(response.data);
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
      setUsers(users.map((u) => (u.id === id ? response.data : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search) ||
      u.vehicleNumber?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) return <LoadingSpinner text="Fetching registered user directories..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            User Account Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            System-wide drivers, commuters, and active registered accounts.
          </p>
        </div>

        <button onClick={fetchUsers} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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
            placeholder="Search by name, email, phone, or vehicle plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="ALL">All Roles</option>
            <option value="USER">Drivers (USER)</option>
            <option value="OWNER">Operators (OWNER)</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>User Profile</th>
                <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                <th style={{ padding: '0.85rem 1rem' }}>Phone</th>
                <th style={{ padding: '0.85rem 1rem' }}>Plate / Details</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                    #USR-{u.id}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{u.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'OWNER' ? 'badge-warning' : 'badge-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                    {u.phone || '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {u.vehicleNumber || 'No plate set'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${u.active ? 'badge-success' : 'badge-neutral'}`}>
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        disabled={actionLoadingId === u.id}
                        className={`btn btn-sm ${u.active ? 'btn-danger-outline' : 'btn-success'}`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        {actionLoadingId === u.id ? '...' : u.active ? 'Disable' : 'Enable'}
                      </button>
                    )}
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

export default AdminUsersPage;
