import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import SkeletonLoader, { TableSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { 
  Building2, 
  PlusCircle, 
  MapPin, 
  Trash2, 
  Edit, 
  Layers, 
  ExternalLink,
  Eye
} from 'lucide-react';
import { INDIAN_CITIES } from '../../data/indianDestinations';

const MyParkingLotsPage = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Lot Modal State
  const [editingLot, setEditingLot] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', address: '', city: '', pincode: '', active: true });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchLots = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await parkingApi.getMyParkingLots();
      setLots(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"? All associated bays and bookings will be removed.`)) return;
    try {
      await parkingApi.deleteParkingLot(id);
      setLots(lots.filter(l => l.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete parking lot');
    }
  };

  const openEditModal = (lot) => {
    setEditingLot(lot);
    setEditFormData({
      name: lot.name,
      address: lot.address,
      city: lot.city,
      pincode: lot.pincode,
      active: lot.active,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await parkingApi.updateParkingLot(editingLot.id, editFormData);
      setLots(lots.map(l => l.id === editingLot.id ? res.data : l));
      setEditingLot(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update parking lot');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
              🇮🇳 Owner Facilities Hub
            </span>
          </div>
          <h1 className="page-title">
            <Building2 size={28} style={{ color: 'var(--primary)' }} />
            My Parking Facilities
          </h1>
          <p className="page-subtitle">Add, edit, or configure your parking facilities and bay inventories across Indian cities.</p>
        </div>
        <Link to="/owner/create-lot" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Add New Parking Lot</span>
        </Link>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : lots.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>Address & City</th>
                <th>Total Bays</th>
                <th>Vacant Bays</th>
                <th>Rate From (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{lot.name}</div>
                    <small style={{ color: 'var(--text-muted)' }}>Facility #PK-{lot.id}</small>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{lot.address}, <strong>{lot.city}</strong> ({lot.pincode})</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{lot.totalSlots}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${lot.availableSlots > 5 ? 'available' : lot.availableSlots > 0 ? 'limited' : 'full'}`} style={{ fontSize: '0.72rem' }}>
                      <span className="status-indicator-dot" />
                      {lot.availableSlots} Free
                    </span>
                  </td>
                  <td>
                    <strong>₹{lot.startingPrice ? Number(lot.startingPrice).toFixed(0) : '30'}/hr</strong>
                  </td>
                  <td>
                    <span className={`badge ${lot.active ? 'badge-success' : 'badge-neutral'}`}>
                      {lot.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Link 
                        to={`/owner/lots/${lot.id}/slots`} 
                        className="btn btn-primary btn-sm"
                        title="Manage bay slots"
                      >
                        <Layers size={14} /> Configure
                      </Link>
                      <button
                        onClick={() => openEditModal(lot)}
                        className="btn btn-secondary btn-sm"
                        title="Edit facility details"
                      >
                        <Edit size={14} />
                      </button>
                      <Link 
                        to={`/parking-lots/${lot.id}`} 
                        className="btn btn-secondary btn-sm"
                        title="View public preview"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(lot.id, lot.name)}
                        className="btn btn-danger-outline btn-sm"
                        title="Delete facility"
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
          title="No Parking Facilities Registered"
          description="List your parking facility in Lucknow or any Indian city to start receiving automated customer bookings."
          actionText="Create Your First Parking Lot"
          actionLink="/owner/create-lot"
        />
      )}

      {/* Edit Modal */}
      {editingLot && (
        <Modal
          isOpen={!!editingLot}
          onClose={() => setEditingLot(null)}
          title={`Edit Facility: ${editingLot.name}`}
        >
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Facility Name</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Address / Landmark</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <select
                  className="form-select"
                  value={editFormData.city}
                  onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  required
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.pincode}
                  onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input
                type="checkbox"
                id="editLotActive"
                checked={editFormData.active}
                onChange={(e) => setEditFormData({ ...editFormData, active: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="editLotActive" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Active Facility (Open for public booking)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setEditingLot(null)} className="btn btn-secondary">
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

export default MyParkingLotsPage;
