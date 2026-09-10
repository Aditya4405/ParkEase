import React, { useState, useEffect } from 'react';
import { ownerApi } from '../../api/ownerApi';
import { 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Building2,
  Download
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const OwnerRevenuePage = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ownerApi.getRevenue();
      setRevenueData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Calculating revenue and settlement ledger..." />;
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Revenue & Settlements
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Real-time financial metrics, completed parking payments, and periodic payouts.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={14} />
          <span>Export Statement</span>
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Revenue Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Revenue</span>
            <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.4rem', borderRadius: '8px' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            ₹{revenueData?.totalRevenue ? Number(revenueData.totalRevenue).toLocaleString('en-IN') : '0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowUpRight size={14} /> All-time collected
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Today's Revenue</span>
            <div style={{ background: '#dbeafe', color: '#2563eb', padding: '0.4rem', borderRadius: '8px' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            ₹{revenueData?.todayRevenue ? Number(revenueData.todayRevenue).toLocaleString('en-IN') : '0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
            Since 00:00 IST today
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>This Week</span>
            <div style={{ background: '#ede9fe', color: '#7c3aed', padding: '0.4rem', borderRadius: '8px' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            ₹{revenueData?.weekRevenue ? Number(revenueData.weekRevenue).toLocaleString('en-IN') : '0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
            Last 7 days cumulative
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>This Month</span>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.4rem', borderRadius: '8px' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            ₹{revenueData?.monthRevenue ? Number(revenueData.monthRevenue).toLocaleString('en-IN') : '0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
            Current calendar month
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Recent Payment Transactions
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {revenueData?.recentTransactions?.length || 0} Records
          </span>
        </div>

        {revenueData?.recentTransactions && revenueData.recentTransactions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Txn ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Booking Ref</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Facility / Bay</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Date & Time</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Method</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.recentTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                      {tx.transactionId}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontFamily: 'monospace', color: '#475569' }}>
                      #PE-BK-{tx.bookingId}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{tx.parkingLotName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Slot: {tx.slotNumber}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b', fontSize: '0.82rem' }}>
                      {new Date(tx.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#334155' }}>
                      {tx.paymentMethod}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: '#dcfce7',
                        color: '#15803d'
                      }}>
                        <CheckCircle2 size={11} /> {tx.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                      ₹{tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
            <Building2 size={36} style={{ margin: '0 auto 0.75rem', color: '#94a3b8' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No payment transactions recorded yet.</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>When drivers complete parking reservations at your lots, transactions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerRevenuePage;
