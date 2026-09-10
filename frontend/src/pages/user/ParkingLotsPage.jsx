import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import ParkingLotCard from '../../components/parking/ParkingLotCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { 
  Search, 
  MapPin, 
  Filter, 
  RotateCw, 
  Car, 
  Bike, 
  Zap, 
  CheckCircle, 
  SlidersHorizontal,
  X,
  Database,
  Building,
  Navigation,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { INDIAN_CITIES, DESTINATION_CATEGORIES } from '../../data/indianDestinations';

const ParkingLotsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [selectedVehicleType, setSelectedVehicleType] = useState('ALL');
  const [evOnly, setEvOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedDataSource, setSelectedDataSource] = useState('ALL');

  // Mobile Filter Drawer
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch Parking Lots from Backend
  const fetchParkingLots = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params = {};
      if (selectedCity && selectedCity.trim() !== '') {
        params.city = selectedCity.trim();
      }
      if (searchQuery && searchQuery.trim() !== '') {
        params.search = searchQuery.trim();
      }
      if (selectedCategory && selectedCategory !== 'ALL') {
        params.category = selectedCategory;
      }

      const response = await parkingApi.searchParkingLots(params);
      setParkingLots(response.data || []);
    } catch (err) {
      console.error('Failed to load parking lots:', err);
      setError('Unable to load parking locations. Please check your connection and retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParkingLots();
  }, [selectedCity, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (searchQuery) newParams.search = searchQuery;
    if (selectedCity) newParams.city = selectedCity;
    if (selectedCategory !== 'ALL') newParams.category = selectedCategory;
    setSearchParams(newParams);
    fetchParkingLots();
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    const newParams = {};
    if (searchQuery) newParams.search = searchQuery;
    if (cityName) newParams.city = cityName;
    if (selectedCategory !== 'ALL') newParams.category = selectedCategory;
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    const newParams = {};
    if (searchQuery) newParams.search = searchQuery;
    if (selectedCity) newParams.city = selectedCity;
    if (catId !== 'ALL') newParams.category = catId;
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedCategory('ALL');
    setSelectedVehicleType('ALL');
    setEvOnly(false);
    setAvailableOnly(false);
    setMaxPrice(100);
    setSelectedDataSource('ALL');
    setSearchParams({});
  };

  // Client-Side Refinements
  const filteredLots = parkingLots.filter((lot) => {
    // Vehicle type filter
    if (selectedVehicleType !== 'ALL') {
      const hasType = lot.slots?.some(
        (s) => s.vehicleType === selectedVehicleType && s.active
      );
      if (!hasType && lot.slots && lot.slots.length > 0) return false;
    }

    // EV Only filter
    if (evOnly) {
      const hasEV = lot.hasEVCharging || lot.slots?.some((s) => s.vehicleType === 'EV' && s.active);
      if (!hasEV) return false;
    }

    // Available Only filter
    if (availableOnly) {
      const openSlots = lot.availableSlots !== undefined ? lot.availableSlots : 1;
      if (openSlots <= 0) return false;
    }

    // Data Source filter
    if (selectedDataSource !== 'ALL') {
      if (lot.dataSource !== selectedDataSource) return false;
    }

    // Max Price filter
    const minPrice = lot.startingPrice || (lot.slots && lot.slots.length > 0 ? Math.min(...lot.slots.map((s) => s.price || 40)) : 30);
    if (minPrice > maxPrice) return false;

    return true;
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      {/* Top Destination Search Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Navigation size={13} /> Destination-Based Discovery
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Find Parking Near Your Destination
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Discover verified parking facilities near malls, railway stations, hospitals, colleges and markets across India.
            </p>
          </div>

          <button
            onClick={() => fetchParkingLots(true)}
            className="btn btn-secondary"
            disabled={refreshing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <RotateCw size={15} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Updating Telemetry...' : 'Refresh Occupancy'}
          </button>
        </div>

        {/* Search Bar & City Selector */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.2fr) minmax(180px, 2.5fr) auto', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* City Selector */}
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            <select
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem', fontWeight: 600, height: '48px', appearance: 'auto' }}
            >
              <option value="">All Indian Cities</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} {c.hub ? '(Demo Hub)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Destination / Keyword Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search destination, mall, railway station, hospital or area (e.g. Phoenix Palassio, Charbagh, KGMU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.6rem', height: '48px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 1.5rem', fontWeight: 700 }}>
            Search Parking
          </button>
        </form>

        {/* Destination Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
          {DESTINATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--primary)' : 'var(--surface)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Parking Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="discovery-layout">
        
        {/* Desktop Filter Sidebar */}
        <div
          className="filter-sidebar card"
          style={{
            padding: '1.4rem',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            position: 'sticky',
            top: '90px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <Filter size={16} style={{ color: 'var(--primary)' }} />
              <span>Filters</span>
            </div>
            {(selectedVehicleType !== 'ALL' || evOnly || availableOnly || maxPrice < 100 || selectedDataSource !== 'ALL') && (
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Vehicle Compatibility Filter */}
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.6rem' }}>
              Vehicle Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {['ALL', 'CAR', 'BIKE', 'SUV', 'EV'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedVehicleType(type)}
                  style={{
                    padding: '0.4rem 0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: selectedVehicleType === type ? 700 : 500,
                    border: selectedVehicleType === type ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: selectedVehicleType === type ? 'var(--primary-subtle)' : '#ffffff',
                    color: selectedVehicleType === type ? 'var(--primary)' : 'var(--text-main)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {type === 'ALL' ? 'All Vehicles' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Availability & Amenities Toggles */}
          <div style={{ marginBottom: '1.3rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
              Availability & Facilities
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', cursor: 'pointer', color: '#334155' }}>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Open Vacancies Only</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', cursor: 'pointer', color: '#334155' }}>
              <input
                type="checkbox"
                checked={evOnly}
                onChange={(e) => setEvOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#059669' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Zap size={13} style={{ color: '#059669' }} /> EV Fast-Charging Points
              </span>
            </label>
          </div>

          {/* Data Source Provenance Filter */}
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
              Data Source Provenance
            </label>
            <select
              value={selectedDataSource}
              onChange={(e) => setSelectedDataSource(e.target.value)}
              className="form-control"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}
            >
              <option value="ALL">All Verified Sources</option>
              <option value="OPENSTREETMAP">OpenStreetMap Verified</option>
              <option value="OPERATOR_PORTAL">Operator Registered</option>
              <option value="MUNICIPAL_DATA">Municipal Open Datasets</option>
            </select>
          </div>

          {/* Hourly Price Range Filter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Max Tariff:
              </label>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{maxPrice}/hr
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>₹10</span>
              <span>₹50</span>
              <span>₹100</span>
            </div>
          </div>

          {/* Architecture Transparency Note */}
          <div style={{ marginTop: '1.4rem', padding: '0.8rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#475569', lineHeight: '1.4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
              <span>Real Data Architecture</span>
            </div>
            Static locations sourced from OpenStreetMap & Operator portals. Live occupancy updated via IoT telemetry events.
          </div>
        </div>

        {/* Parking Results List View */}
        <div>
          {/* Results Summary Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 600 }}>
              Showing <strong style={{ color: 'var(--primary)' }}>{filteredLots.length}</strong> parking facilities
              {selectedCity ? ` in ${selectedCity}` : ''}
              {selectedCategory !== 'ALL' ? ` for ${DESTINATION_CATEGORIES.find(c => c.id === selectedCategory)?.name}` : ''}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>Verified Capacity: {filteredLots.reduce((acc, lot) => acc + (lot.totalCapacity || lot.totalSlots || 100), 0)} bays</span>
            </div>
          </div>

          {/* Results Display */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', height: '240px' }}>
                  <SkeletonLoader lines={5} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Connection Error</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
              <button onClick={() => fetchParkingLots()} className="btn btn-primary">
                Retry Discovery
              </button>
            </div>
          ) : filteredLots.length === 0 ? (
            <EmptyState
              icon={<Search size={40} style={{ color: 'var(--text-muted)' }} />}
              title="No Parking Facilities Found"
              description="No parking facilities matched your destination, city, or filter criteria. Try expanding your search or selecting another Indian city."
              actionLabel="Reset All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.3rem' }}>
              {filteredLots.map((lot) => (
                <ParkingLotCard key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .discovery-layout {
            grid-template-columns: 1fr !important;
          }
          .filter-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ParkingLotsPage;
