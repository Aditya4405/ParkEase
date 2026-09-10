import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Car, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getStatistics();
      setStats(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Computing system-wide analytics and city distributions..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Platform Growth & Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Macro-level metrics across registered drivers, facility operators, and reservation turnover.
          </p>
        </div>

        <button onClick={fetchStats} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Registered Drivers</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>
            {stats?.totalUsers || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Active commuters & vehicle owners</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Facility Partners</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>
            {stats?.totalOwners || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>Commercial operators</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Parking Facilities</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>
            {stats?.totalParkingLots || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Across North India cities</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Revenue (₹)</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>
            ₹{stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString('en-IN') : '0'}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Cumulative platform volume</span>
        </div>
      </div>

      {/* Grid: City Breakdown & Vehicle Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* City Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <MapPin size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Geographical Facility Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.cityBreakdown && Object.entries(stats.cityBreakdown).length > 0 ? (
              Object.entries(stats.cityBreakdown).map(([city, count]) => {
                const total = stats.totalParkingLots || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={city}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: '#334155' }}>
                      <span>{city}</span>
                      <span>{count} facilities ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No city records available.</div>
            )}
          </div>
        </div>

        {/* Vehicle Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Car size={20} color="#0284c7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Fleet & Vehicle Bay Inventory
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { type: 'CAR / SEDAN / HATCHBACK', count: stats?.vehicleBreakdown?.CAR || stats?.vehicleBreakdown?.Car || 0, color: '#4f46e5' },
              { type: 'TWO-WHEELER / BIKE', count: stats?.vehicleBreakdown?.BIKE || stats?.vehicleBreakdown?.Bike || 0, color: '#0284c7' },
              { type: 'SUV / LARGE VEHICLE', count: stats?.vehicleBreakdown?.SUV || stats?.vehicleBreakdown?.Suv || 0, color: '#10b981' },
            ].map((v) => {
              const total = stats?.totalSlots || 1;
              const pct = Math.round((v.count / total) * 100) || 0;
              return (
                <div key={v.type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: '#334155' }}>
                    <span>{v.type}</span>
                    <span>{v.count} slots ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: v.color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;
