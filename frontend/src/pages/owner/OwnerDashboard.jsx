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
  Zap,
  Radio,
  Car,
  RotateCw,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Database
} from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Occupancy Operations State
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [simulatedVehicleNo, setSimulatedVehicleNo] = useState('UP 32 AB 1234');
  const [simulatingEvent, setSimulatingEvent] = useState(false);
  const [eventMessage, setEventMessage] = useState(null);
  const [telemetryEvents, setTelemetryEvents] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lotsRes, bookingsRes] = await Promise.all([
        parkingApi.getMyParkingLots(),
        bookingApi.getOwnerBookings()
      ]);
      const myLots = lotsRes.data || [];
      setLots(myLots);
      setBookings(bookingsRes.data || []);
      
      if (myLots.length > 0 && !selectedLotId) {
        setSelectedLotId(myLots[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load operator dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch telemetry events when selected lot changes
  useEffect(() => {
    if (!selectedLotId) return;
    const fetchEvents = async () => {
      try {
        const res = await parkingApi.getOccupancyEvents(selectedLotId);
        setTelemetryEvents(res.data || []);
      } catch (err) {
        console.error('Failed to load telemetry events:', err);
      }
    };
    fetchEvents();
  }, [selectedLotId]);

  const handleTriggerOccupancy = async (eventType) => {
    if (!selectedLotId) return;
    try {
      setSimulatingEvent(true);
      setEventMessage(null);

      const payload = {
        eventType,
        vehicleNumber: simulatedVehicleNo.trim() || `UP 32 TEST ${(Math.random()*9000+1000).toFixed(0)}`,
        source: 'DEMO_OPERATOR_GATE'
      };

      const res = await parkingApi.recordOccupancyEvent(selectedLotId, payload);
      
      setEventMessage({
        type: 'success',
        text: res.data.message || `Vehicle ${eventType} recorded successfully!`
      });

      // Update lot in local state
      setLots(prev => prev.map(lot => {
        if (lot.id === selectedLotId) {
          return {
            ...lot,
            occupiedSlots: res.data.occupiedSlots,
            reservedSlots: res.data.reservedSlots,
            availableSlots: res.data.availableSlots,
          };
        }
        return lot;
      }));

      // Refresh events log
      const eventsRes = await parkingApi.getOccupancyEvents(selectedLotId);
      setTelemetryEvents(eventsRes.data || []);

      // Auto clear message after 5s
      setTimeout(() => setEventMessage(null), 5000);
    } catch (err) {
      setEventMessage({
        type: 'error',
        text: err.response?.data?.message || `Failed to process ${eventType}`
      });
    } finally {
      setSimulatingEvent(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem 1rem' }}><SkeletonLoader count={4} /></div>;

  const totalCapacitySum = lots.reduce((acc, lot) => acc + (lot.totalCapacity || lot.totalSlots || 100), 0);
  const totalOccupiedSum = lots.reduce((acc, lot) => acc + (lot.occupiedSlots || 0), 0);
  const totalReservedSum = lots.reduce((acc, lot) => acc + (lot.reservedSlots || 0), 0);
  const totalAvailableSum = lots.reduce((acc, lot) => acc + (lot.availableSlots !== undefined ? lot.availableSlots : 0), 0);
  
  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const selectedLot = lots.find(l => l.id === Number(selectedLotId)) || lots[0];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Activity size={14} /> Parking Operator Command Center
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            {user?.name || 'Facility Operator'} Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Real-time occupancy control, gate telemetry simulation, and facility revenue management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/owner/create-lot" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <PlusCircle size={16} />
            <span>Add New Parking Lot</span>
          </Link>
        </div>
      </div>

      {/* Top Aggregated Metric Cards */}
      <div className="grid-4" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ padding: '1.4rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Managed Lots</span>
            <Building2 size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>{lots.length}</div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Verified Facilities</span>
        </div>

        <div className="card" style={{ padding: '1.4rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Capacity</span>
            <Layers size={18} style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0284c7' }}>{totalCapacitySum}</div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Vehicle Bays</span>
        </div>

        <div className="card" style={{ padding: '1.4rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Live Occupied</span>
            <Radio size={18} style={{ color: '#e11d48' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e11d48' }}>{totalOccupiedSum}</div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{totalReservedSum} Active Reservations</span>
        </div>

        <div className="card" style={{ padding: '1.4rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Gross Bookings</span>
            <CreditCard size={18} style={{ color: '#059669' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669' }}>₹{totalRevenue.toFixed(0)}</div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{bookings.length} reservations</span>
        </div>
      </div>

      {/* =========================================================
          PARKING OPERATIONS / OCCUPANCY CONTROL (PROTOTYPE TELEMETRY)
          ========================================================= */}
      <div 
        className="card" 
        style={{ 
          padding: '2rem', 
          borderRadius: '18px', 
          border: '1px solid #cbd5e1', 
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          marginBottom: '2.5rem',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ padding: '0.25rem 0.6rem', background: '#ecfdf5', color: '#059669', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800 }}>
                ⚡ PROTOTYPE SIMULATION
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                Parking Operations & Occupancy Control
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '680px' }}>
              Simulate boom-barrier and sensor telemetry events. In production, ANPR cameras, FASTag readers, and loop sensors trigger these events automatically.
            </p>
          </div>

          {/* Facility Selector */}
          {lots.length > 0 && (
            <div style={{ minWidth: '260px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Select Active Facility
              </label>
              <select
                value={selectedLotId || ''}
                onChange={(e) => setSelectedLotId(Number(e.target.value))}
                className="form-control"
                style={{ fontWeight: 600, fontSize: '0.88rem' }}
              >
                {lots.map(l => (
                  <option key={l.id} value={l.id}>{l.name} ({l.city})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Lot Telemetry Gauges */}
        {selectedLot && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              
              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Capacity</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
                  {selectedLot.totalCapacity || selectedLot.totalSlots || 100}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Designated Bays</span>
              </div>

              <div style={{ padding: '1rem', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#be123c', textTransform: 'uppercase' }}>Occupied (Physical)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e11d48' }}>
                  {selectedLot.occupiedSlots || 0}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#be123c' }}>Inside Facility</span>
              </div>

              <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Reserved (Hold)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706' }}>
                  {selectedLot.reservedSlots || 0}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#b45309' }}>Advance Bookings</span>
              </div>

              <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Available (Open)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669' }}>
                  {selectedLot.availableSlots !== undefined ? selectedLot.availableSlots : 0}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#047857' }}>Bookable Vacancy</span>
              </div>
            </div>

            {/* Interactive Trigger Controls */}
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '14px', 
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                  Test Vehicle Plate:
                </label>
                <input
                  type="text"
                  value={simulatedVehicleNo}
                  onChange={(e) => setSimulatedVehicleNo(e.target.value)}
                  placeholder="e.g. UP 32 AB 1234"
                  className="form-control"
                  style={{ width: '180px', fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleTriggerOccupancy('ENTRY')}
                  disabled={simulatingEvent}
                  className="btn btn-primary"
                  style={{ 
                    background: '#059669', 
                    borderColor: '#059669', 
                    padding: '0.65rem 1.4rem', 
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Car size={16} />
                  <span>[ Vehicle ENTRY ]</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerOccupancy('EXIT')}
                  disabled={simulatingEvent}
                  className="btn btn-secondary"
                  style={{ 
                    color: '#e11d48', 
                    borderColor: '#fecdd3', 
                    background: '#fff1f2',
                    padding: '0.65rem 1.4rem', 
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Car size={16} />
                  <span>[ Vehicle EXIT ]</span>
                </button>
              </div>
            </div>

            {/* Event Notification Message */}
            {eventMessage && (
              <div style={{ 
                padding: '0.85rem 1rem', 
                borderRadius: '10px', 
                marginBottom: '1.5rem',
                background: eventMessage.type === 'success' ? '#ecfdf5' : '#fff1f2',
                border: `1px solid ${eventMessage.type === 'success' ? '#a7f3d0' : '#fecdd3'}`,
                color: eventMessage.type === 'success' ? '#065f46' : '#9f1239',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.86rem',
                fontWeight: 600
              }}>
                {eventMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{eventMessage.text}</span>
              </div>
            )}

            {/* Telemetry Audit Log */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155', marginBottom: '0.75rem' }}>
                Recent Telemetry Events (Simulated Gate Stream)
              </h4>
              
              {telemetryEvents.length === 0 ? (
                <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
                  No telemetry events recorded yet for this facility. Click [Vehicle Entry] or [Vehicle Exit] above to simulate gate activity.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <table className="table" style={{ margin: 0, fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th>Event ID</th>
                        <th>Event Type</th>
                        <th>Vehicle Number</th>
                        <th>Source Sensor / Gate</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {telemetryEvents.slice(0, 5).map(ev => (
                        <tr key={ev.id}>
                          <td><strong>#EV-{String(ev.id).padStart(4, '0')}</strong></td>
                          <td>
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: ev.eventType === 'ENTRY' ? '#ecfdf5' : '#fff1f2',
                              color: ev.eventType === 'ENTRY' ? '#059669' : '#e11d48'
                            }}>
                              {ev.eventType}
                            </span>
                          </td>
                          <td><strong>{ev.vehicleNumber || 'N/A'}</strong></td>
                          <td><code>{ev.source || 'DEMO_OPERATOR'}</code></td>
                          <td>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                          <td><span style={{ color: '#059669', fontWeight: 600 }}>● Processed</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Managed Facilities Table */}
      <div className="card" style={{ padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Your Parking Facilities</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Locations registered under your operator account.</p>
          </div>
          <Link to="/owner/parking-lots" className="btn btn-secondary" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
            Manage All Lots <ArrowRight size={14} />
          </Link>
        </div>

        {lots.length === 0 ? (
          <EmptyState
            title="No Parking Lots Registered"
            description="You have not created any parking lots yet. Register your first facility to start accepting online advance bookings."
            actionLabel="Create Parking Lot"
            actionLink="/owner/create-lot"
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Facility Name</th>
                  <th>Location</th>
                  <th>Total Capacity</th>
                  <th>Occupied</th>
                  <th>Reserved</th>
                  <th>Live Open</th>
                  <th>Tariff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{lot.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lot.parkingType || 'Covered Stack'}</div>
                    </td>
                    <td>{lot.city}</td>
                    <td><strong>{lot.totalCapacity || lot.totalSlots || 100}</strong> bays</td>
                    <td style={{ color: '#e11d48', fontWeight: 700 }}>{lot.occupiedSlots || 0}</td>
                    <td style={{ color: '#d97706', fontWeight: 700 }}>{lot.reservedSlots || 0}</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>{lot.availableSlots !== undefined ? lot.availableSlots : 0}</td>
                    <td><strong>₹{lot.startingPrice || 40}/hr</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link to={`/owner/parking-lots/${lot.id}/slots`} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          Slots
                        </Link>
                        <Link to={`/parking-lots/${lot.id}`} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
