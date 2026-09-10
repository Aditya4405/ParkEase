import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import SkeletonLoader, { TableSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  Car, 
  Bike, 
  Shield, 
  Zap,
  CheckCircle, 
  XCircle,
  Building2 
} from 'lucide-react';

const ManageSlotsPage = () => {
  const { id } = useParams();
  const [lot, setLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Slot Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSlotData, setNewSlotData] = useState({
    slotNumber: '',
    price: 40.00,
    size: 'MEDIUM',
    vehicleType: 'CAR',
    active: true,
    isAvailable: true,
  });
  const [adding, setAdding] = useState(false);

  // Edit Slot Modal
  const [editingSlot, setEditingSlot] = useState(null);
  const [editSlotData, setEditSlotData] = useState({
    slotNumber: '',
    price: 40.00,
    size: 'MEDIUM',
    vehicleType: 'CAR',
    active: true,
    isAvailable: true,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchLotAndSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const [lotRes, slotsRes] = await Promise.all([
        parkingApi.getParkingLotById(id),
        parkingApi.getSlotsByLotId(id),
      ]);
      setLot(lotRes.data);
      setSlots(slotsRes.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotAndSlots();
  }, [id]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await parkingApi.addSlot(id, {
        ...newSlotData,
        price: parseFloat(newSlotData.price),
      });
      setSlots([...slots, res.data]);
      setIsAddOpen(false);
      setNewSlotData({
        slotNumber: '',
        price: 40.00,
        size: 'MEDIUM',
        vehicleType: 'CAR',
        active: true,
        isAvailable: true,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add slot');
    } finally {
      setAdding(false);
    }
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setEditSlotData({
      slotNumber: slot.slotNumber,
      price: slot.price,
      size: slot.size,
      vehicleType: slot.vehicleType,
      active: slot.active,
      isAvailable: slot.isAvailable,
    });
  };

  const handleEditSlot = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await parkingApi.updateSlot(editingSlot.id, {
        ...editSlotData,
        price: parseFloat(editSlotData.price),
      });
      setSlots(slots.map(s => s.id === editingSlot.id ? res.data : s));
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

  const toggleSlotActive = async (slot) => {
    try {
      const res = await parkingApi.updateSlot(slot.id, {
        slotNumber: slot.slotNumber,
        price: slot.price,
        size: slot.size,
        vehicleType: slot.vehicleType,
        active: !slot.active,
        isAvailable: slot.isAvailable,
      });
      setSlots(slots.map(s => s.id === slot.id ? res.data : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  if (loading) return <SkeletonLoader count={4} />;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/owner/lots" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Facilities</span>
        </Link>
      </div>

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">
            <Layers size={28} style={{ color: 'var(--primary)' }} />
            Configure Bays: {lot?.name}
          </h1>
          <p className="page-subtitle">
            {lot?.address}, {lot?.city} – Total {slots.length} bays configured with Indian tariffs (₹).
          </p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Parking Bay</span>
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Slots Table */}
      {slots.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bay Number</th>
                <th>Vehicle Category</th>
                <th>Bay Size</th>
                <th>Hourly Tariff</th>
                <th>Slot Status</th>
                <th>Inventory State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id}>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{slot.slotNumber}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {slot.vehicleType === 'BIKE' ? <Bike size={16} style={{ color: '#059669' }} /> : slot.vehicleType === 'SUV' ? <Shield size={16} style={{ color: '#d97706' }} /> : slot.vehicleType === 'EV' ? <Zap size={16} style={{ color: '#10b981' }} /> : <Car size={16} style={{ color: 'var(--primary)' }} />}
                      <span>{slot.vehicleType === 'EV' ? 'EV Charging' : slot.vehicleType}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{slot.size}</span>
                  </td>
                  <td>
                    <strong>₹{slot.price ? Number(slot.price).toFixed(0) : '40'} / hr</strong>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleSlotActive(slot)}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle active status"
                    >
                      <span className={`badge ${slot.active ? 'badge-success' : 'badge-danger'}`}>
                        {slot.active ? 'Active' : 'Disabled'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <span className={`status-pill ${slot.isAvailable ? 'available' : 'limited'}`} style={{ fontSize: '0.72rem' }}>
                      <span className="status-indicator-dot" />
                      {slot.isAvailable ? 'Vacant' : 'Occupied'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => openEditModal(slot)}
                        className="btn btn-secondary btn-sm"
                        title="Edit slot details"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot.id, slot.slotNumber)}
                        className="btn btn-danger-outline btn-sm"
                        title="Delete slot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Slots in this Facility"
          description="Add Car, Bike, SUV or EV charging bays so Indian drivers can discover and book them."
          actionText="Add Your First Bay"
          onAction={() => setIsAddOpen(true)}
        />
      )}

      {/* Add Slot Modal */}
      {isAddOpen && (
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Parking Bay">
          <form onSubmit={handleAddSlot}>
            <div className="form-group">
              <label className="form-label">Bay Number / Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CAR-101 / EV-01 / 2W-05"
                value={newSlotData.slotNumber}
                onChange={(e) => setNewSlotData({ ...newSlotData, slotNumber: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Vehicle Category</label>
                <select
                  className="form-select"
                  value={newSlotData.vehicleType}
                  onChange={(e) => setNewSlotData({ ...newSlotData, vehicleType: e.target.value })}
                >
                  <option value="CAR">Car (4-Wheeler)</option>
                  <option value="BIKE">Bike (2-Wheeler)</option>
                  <option value="SUV">SUV (Large Bay)</option>
                  <option value="EV">EV Charging Bay ⚡</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bay Size</label>
                <select
                  className="form-select"
                  value={newSlotData.size}
                  onChange={(e) => setNewSlotData({ ...newSlotData, size: e.target.value })}
                >
                  <option value="SMALL">Small (Bike/Scooter)</option>
                  <option value="MEDIUM">Medium (Hatch/Sedan)</option>
                  <option value="LARGE">Large (SUV/Fortuner)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hourly Tariff Rate (₹ / hr)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="form-input"
                  value={newSlotData.price}
                  onChange={(e) => setNewSlotData({ ...newSlotData, price: e.target.value })}
                  required
                  style={{ paddingLeft: '2rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={adding}>
                {adding ? <LoadingSpinner text="Adding..." /> : 'Add Parking Bay'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Slot Modal */}
      {editingSlot && (
        <Modal isOpen={!!editingSlot} onClose={() => setEditingSlot(null)} title={`Edit Bay ${editingSlot.slotNumber}`}>
          <form onSubmit={handleEditSlot}>
            <div className="form-group">
              <label className="form-label">Bay Number / Code</label>
              <input
                type="text"
                className="form-input"
                value={editSlotData.slotNumber}
                onChange={(e) => setEditSlotData({ ...editSlotData, slotNumber: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Vehicle Category</label>
                <select
                  className="form-select"
                  value={editSlotData.vehicleType}
                  onChange={(e) => setEditSlotData({ ...editSlotData, vehicleType: e.target.value })}
                >
                  <option value="CAR">Car (4-Wheeler)</option>
                  <option value="BIKE">Bike (2-Wheeler)</option>
                  <option value="SUV">SUV (Large Bay)</option>
                  <option value="EV">EV Charging Bay ⚡</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bay Size</label>
                <select
                  className="form-select"
                  value={editSlotData.size}
                  onChange={(e) => setEditSlotData({ ...editSlotData, size: e.target.value })}
                >
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hourly Tariff Rate (₹ / hr)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="form-input"
                  value={editSlotData.price}
                  onChange={(e) => setEditSlotData({ ...editSlotData, price: e.target.value })}
                  required
                  style={{ paddingLeft: '2rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input
                type="checkbox"
                id="editSlotActive"
                checked={editSlotData.active}
                onChange={(e) => setEditSlotData({ ...editSlotData, active: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="editSlotActive" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Bay is Active (Open for reservation)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setEditingSlot(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={savingEdit}>
                {savingEdit ? <LoadingSpinner text="Saving..." /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageSlotsPage;
