import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { 
  Grid3X3, 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Car, 
  Bike, 
  Shield, 
  Zap, 
  CheckCircle2, 
  XCircle,
  IndianRupee
} from 'lucide-react';

const OwnerSlotsPage = () => {
  const [lots, setLots] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState('ALL');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Quick Price / Slot Edit Modal
  const [editingSlot, setEditingSlot] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchLotsAndSlots();
  }, []);

  const fetchLotsAndSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const lotsRes = await parkingApi.getMyParkingLots();
      const myLots = lotsRes.data || [];
      setLots(myLots);

      // Fetch all slots from all lots
      const allSlotsPromises = myLots.map(lot => 
        parkingApi.getSlotsByLotId(lot.id)
          .then(res => res.data.map(slot => ({ ...slot, parkingLotName: lot.name, parkingLotCity: lot.city })))
          .catch(() => [])
      );

      const slotsArrays = await Promise.all(allSlotsPromises);
      const flattened = slotsArrays.flat();
      setSlots(flattened);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await parkingApi.updateSlot(editingSlot.id, {
        slotNumber: editingSlot.slotNumber,
        price: parseFloat(editPrice),
        size: editingSlot.size,
        vehicleType: editingSlot.vehicleType,
        active: editActive,
        isAvailable: editingSlot.isAvailable,
      });

      setSlots(slots.map(s => s.id === editingSlot.id ? { ...s, price: parseFloat(editPrice), active: editActive } : s));
      setEditingSlot(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update slot');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteSlot = async (slotId, slotNum) => {
    if (!window.confirm(`Are you sure you want to delete bay ${slotNum}?`)) return;
    try {
      await parkingApi.deleteSlot(slotId);
      setSlots(slots.filter(s => s.id !== slotId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete slot');
    }
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setEditPrice(slot.price);
    setEditActive(slot.active);
  };

  const filteredSlots = slots.filter((s) => {
    const matchLot = selectedLotId === 'ALL' || s.parkingLotId === Number(selectedLotId);
    const matchSearch =
      s.slotNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.parkingLotName?.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicleType?.toLowerCase().includes(search.toLowerCase());
    return matchLot && matchSearch;
  });

  if (loading) return <SkeletonLoader count={4} />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Parking Bay & Tariff Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Set hourly rates, vehicle types, and active statuses across all your parking facilities.
          </p>
        </div>

        {lots.length > 0 && (
          <Link to={`/owner/lots/${lots[0].id}/slots`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={15} />
            <span>Add New Bay</span>
          </Link>
        )}
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Filters & Selector */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search bay number, vehicle type, facility..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>

        <div style={{ minWidth: '240px' }}>
          <select
            className="form-input"
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
          >
            <option value="ALL">All Parking Facilities ({lots.length})</option>
            {lots.map((l) => (
              <option key={l.id} value={l.id}>{l.name} ({l.city})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredSlots.length > 0 ? (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Bay Number</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Facility / Location</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Vehicle Type</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Size</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Hourly Tariff (₹)</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Slot Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
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
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{s.parkingLotName}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.parkingLotCity}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#334155' }}>
                        {s.vehicleType === 'BIKE' ? <Bike size={15} color="#059669" /> : s.vehicleType === 'SUV' ? <Shield size={15} color="#d97706" /> : s.vehicleType === 'EV' ? <Zap size={15} color="#10b981" /> : <Car size={15} color="var(--primary)" />}
                        <span>{s.vehicleType}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{s.size}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{s.price}/hr
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${s.active ? 'badge-success' : 'badge-danger'}`}>
                        {s.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEditModal(s)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Bay & Tariff"
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(s.id, s.slotNumber)}
                          className="btn btn-danger-outline btn-sm"
                          title="Delete Bay"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Parking Bays Found"
          description="You haven't configured any individual parking bays for your lots yet."
          actionText="Manage Facilities"
          actionLink="/owner/parking-locations"
        />
      )}

      {/* Quick Edit Modal */}
      {editingSlot && (
        <Modal
          isOpen={!!editingSlot}
          onClose={() => setEditingSlot(null)}
          title={`Update Bay ${editingSlot.slotNumber}`}
        >
          <form onSubmit={handleEditSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Facility</label>
              <input type="text" className="form-input" value={editingSlot.parkingLotName} disabled />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Hourly Tariff (₹/hour)</label>
              <input
                type="number"
                step="1"
                min="0"
                className="form-input"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="editSlotActive"
                checked={editActive}
                onChange={(e) => setEditActive(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="editSlotActive" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Bay is Operational / Active
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setEditingSlot(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default OwnerSlotsPage;
