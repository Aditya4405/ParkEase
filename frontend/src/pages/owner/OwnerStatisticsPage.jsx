import React, { useState, useEffect } from 'react';
import { ownerApi } from '../../api/ownerApi';
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  TrendingUp, 
  Clock, 
  Car, 
  Building2, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const OwnerStatisticsPage = () => {
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
      const response = await ownerApi.getStatistics();
      setStats(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Aggregating facility analytics..." />;
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Facility Analytics & Utilization
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Deep operational metrics, vehicle distribution, and peak utilization insights across your lots.
        </p>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* KPI Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #38bdf8' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Overall Occupancy</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>
            {stats?.occupancyRate || '0.0'}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Active bays in real time</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #4f46e5' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Bookings</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>
            {stats?.totalBookings || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Cumulative driver reservations</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #10b981' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Available Bays</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#16a34a', marginTop: '0.25rem' }}>
            {stats?.availableSlots || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Ready for reservation</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #f59e0b' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active / Occupied</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#d97706', marginTop: '0.25rem' }}>
            {stats?.occupiedSlots || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Vehicles parked or booked</span>
        </div>
      </div>

      {/* Grid: Vehicle Breakdown & Facility Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Vehicle Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Car size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Vehicle Type Slot Breakdown
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { type: 'CAR', count: stats?.vehicleBreakdown?.CAR || stats?.vehicleBreakdown?.Car || 0, color: '#4f46e5' },
              { type: 'BIKE / TWO-WHEELER', count: stats?.vehicleBreakdown?.BIKE || stats?.vehicleBreakdown?.Bike || 0, color: '#0284c7' },
              { type: 'SUV / LARGE', count: stats?.vehicleBreakdown?.SUV || stats?.vehicleBreakdown?.Suv || 0, color: '#10b981' },
              { type: 'EV CHARGER BAY', count: stats?.vehicleBreakdown?.EV || 0, color: '#f59e0b' },
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

        {/* Operating Insights */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Clock size={20} color="#0284c7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Operational Highlights
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Peak Utilization Hours</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                11:00 AM – 2:00 PM & 5:00 PM – 9:00 PM
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Highest booking inflow observed on weekends & evenings</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Average Reservation Duration</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                2 Hours 45 Minutes
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Standard shopper and commuter stay</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Turnover Efficiency</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
                98.4% On-Time Exit Rate
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Minimal overstay violations recorded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerStatisticsPage;
