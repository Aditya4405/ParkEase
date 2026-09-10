import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { CreditCard, Search, RefreshCw, CheckCircle2, XCircle, Clock, ShieldCheck, Download } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getPayments();
      setPayments(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      p.userName?.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      p.parkingLotName?.toLowerCase().includes(search.toLowerCase()) ||
      p.paymentMethod?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) return <LoadingSpinner text="Auditing transaction and payment records..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Financial Transactions & Payments
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            System-wide payment audits, gateway reference keys, and settlement statuses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button onClick={fetchPayments} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Overview Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Settled Volume</span>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Transactions</span>
              <strong style={{ fontSize: '1.25rem' }}>{payments.length}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Success Rate</span>
              <strong style={{ fontSize: '1.25rem', color: '#4ade80' }}>
                {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'SUCCESS').length / payments.length) * 100) : 100}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search txn ID, driver name, email, facility..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Payment Statuses</option>
            <option value="SUCCESS">Success / Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Transaction ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Booking Ref</th>
                <th style={{ padding: '0.85rem 1rem' }}>Driver / Payer</th>
                <th style={{ padding: '0.85rem 1rem' }}>Facility</th>
                <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary)' }}>
                    {p.transactionId}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#475569' }}>
                    #PE-BK-{p.bookingId}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{p.userName}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.userEmail}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                    {p.parkingLotName || 'ParkEase Facility'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#334155' }}>
                    {p.paymentMethod}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#64748b' }}>
                    {new Date(p.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${
                      p.status === 'SUCCESS' ? 'badge-success' :
                      p.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                    ₹{p.amount}
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

export default AdminPaymentsPage;
