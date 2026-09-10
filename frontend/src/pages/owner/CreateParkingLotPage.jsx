import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import { 
  Building2, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Car, 
  Bike, 
  Shield, 
  Zap,
  Sparkles,
  Save,
  MapPin
} from 'lucide-react';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { INDIAN_CITIES } from '../../data/indianDestinations';

const CreateParkingLotPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Lucknow',
    pincode: '226010',
    active: true,
  });

  const [slots, setSlots] = useState([
    { slotNumber: 'CAR-01', price: 40.00, size: 'MEDIUM', vehicleType: 'CAR', active: true, isAvailable: true },
    { slotNumber: 'CAR-02', price: 40.00, size: 'MEDIUM', vehicleType: 'CAR', active: true, isAvailable: true },
    { slotNumber: '2W-01', price: 20.00, size: 'SMALL', vehicleType: 'BIKE', active: true, isAvailable: true },
    { slotNumber: 'SUV-01', price: 60.00, size: 'LARGE', vehicleType: 'SUV', active: true, isAvailable: true },
    { slotNumber: 'EV-01', price: 40.00, size: 'MEDIUM', vehicleType: 'EV', active: true, isAvailable: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLotChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlotRow = () => {
    const nextNum = slots.length + 1;
    setSlots([
      ...slots,
      {
        slotNumber: `BAY-${nextNum < 10 ? '0' + nextNum : nextNum}`,
        price: 40.00,
        size: 'MEDIUM',
        vehicleType: 'CAR',
        active: true,
        isAvailable: true,
      }
    ]);
  };

  const removeSlotRow = (index) => {
    if (slots.length <= 1) {
      alert('A parking lot must have at least one slot.');
      return;
    }
    setSlots(slots.filter((_, i) => i !== index));
  };

  const autoGenerateSlots = (carCount = 4, bikeCount = 3, suvCount = 2, evCount = 2) => {
    const generated = [];
    for (let i = 1; i <= carCount; i++) {
      generated.push({
        slotNumber: `CAR-${i < 10 ? '0' + i : i}`,
        price: 40.00,
        size: 'MEDIUM',
        vehicleType: 'CAR',
        active: true,
        isAvailable: true,
      });
    }
    for (let i = 1; i <= bikeCount; i++) {
      generated.push({
        slotNumber: `2W-${i < 10 ? '0' + i : i}`,
        price: 20.00,
        size: 'SMALL',
        vehicleType: 'BIKE',
        active: true,
        isAvailable: true,
      });
    }
    for (let i = 1; i <= suvCount; i++) {
      generated.push({
        slotNumber: `SUV-${i < 10 ? '0' + i : i}`,
        price: 60.00,
        size: 'LARGE',
        vehicleType: 'SUV',
        active: true,
        isAvailable: true,
      });
    }
    for (let i = 1; i <= evCount; i++) {
      generated.push({
        slotNumber: `EV-${i < 10 ? '0' + i : i}`,
        price: 40.00,
        size: 'MEDIUM',
        vehicleType: 'EV',
        active: true,
        isAvailable: true,
      });
    }
    setSlots(generated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        initialSlots: slots.map(s => ({
          ...s,
          price: parseFloat(s.price),
        })),
      };

      const res = await parkingApi.createParkingLot(payload);
      navigate(`/owner/lots/${res.data.id}/slots`);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '880px', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/owner/lots" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to My Lots</span>
        </Link>
      </div>

      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
            🇮🇳 India Smart Facility Onboarding
          </span>
        </div>
        <h1 className="page-title">
          <Building2 size={28} style={{ color: 'var(--primary)' }} />
          Create New Parking Facility
        </h1>
        <p className="page-subtitle">Provide your facility details and define its parking bays, sizes, and INR (₹) hourly tariffs.</p>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            1. Facility Location & Details (India)
          </h3>

          <div className="form-group">
            <label className="form-label">Parking Facility Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Phoenix Palassio Multi-Level Parking"
              value={formData.name}
              onChange={handleLotChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Street Address / Landmark</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="e.g. Sector 7, Amar Shaheed Path, Gomti Nagar Extension"
              value={formData.address}
              onChange={handleLotChange}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">City / Region</label>
              <select
                name="city"
                className="form-select"
                value={formData.city}
                onChange={handleLotChange}
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
                name="pincode"
                className="form-input"
                placeholder="e.g. 226010"
                value={formData.pincode}
                onChange={handleLotChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 2: Slot Configuration */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>2. Parking Bay Slots & Hourly Tariffs</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Define slot numbers, supported vehicle types (Car, Bike, SUV, EV), bay sizes, and rates in ₹/hr.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => autoGenerateSlots(4, 3, 2, 2)}
                className="btn btn-secondary btn-sm"
                title="Populate standard Indian mix of Car, 2W, SUV and EV slots"
              >
                <Sparkles size={14} /> Quick Indian Mix Fill
              </button>
              <button
                type="button"
                onClick={addSlotRow}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} /> Add Bay Row
              </button>
            </div>
          </div>

          {/* Slots Table */}
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bay #</th>
                  <th>Vehicle Category</th>
                  <th>Bay Size</th>
                  <th>Hourly Rate (₹/hr)</th>
                  <th style={{ textAlign: 'center' }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, index) => (
                  <tr key={index}>
                    <td style={{ width: '150px' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={slot.slotNumber}
                        onChange={(e) => handleSlotChange(index, 'slotNumber', e.target.value.toUpperCase())}
                        required
                        placeholder="CAR-01"
                        style={{ padding: '0.4rem 0.65rem' }}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={slot.vehicleType}
                        onChange={(e) => handleSlotChange(index, 'vehicleType', e.target.value)}
                        style={{ padding: '0.4rem 0.65rem' }}
                      >
                        <option value="CAR">Car (4-Wheeler)</option>
                        <option value="BIKE">Two-Wheeler (Bike)</option>
                        <option value="SUV">SUV (Large Bay)</option>
                        <option value="EV">EV Charging Bay ⚡</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={slot.size}
                        onChange={(e) => handleSlotChange(index, 'size', e.target.value)}
                        style={{ padding: '0.4rem 0.65rem' }}
                      >
                        <option value="SMALL">SMALL</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LARGE">LARGE</option>
                      </select>
                    </td>
                    <td style={{ width: '130px' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '8px', color: 'var(--text-muted)', fontWeight: 700 }}>₹</span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          className="form-input"
                          value={slot.price}
                          onChange={(e) => handleSlotChange(index, 'price', e.target.value)}
                          required
                          style={{ padding: '0.4rem 0.65rem 0.4rem 1.8rem' }}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', width: '70px' }}>
                      <button
                        type="button"
                        onClick={() => removeSlotRow(index)}
                        className="btn btn-danger-outline btn-sm"
                        style={{ padding: '0.35rem 0.5rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
          <Link to="/owner/lots" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <LoadingSpinner text="Publishing Facility..." /> : (
              <>
                <Save size={18} />
                <span>Publish Parking Facility</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateParkingLotPage;
