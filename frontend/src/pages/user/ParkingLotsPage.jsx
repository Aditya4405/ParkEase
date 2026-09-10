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
  SlidersHorizontal,
  X,
  Building2,
  Navigation,
  ShieldCheck,
  Tag,
  ArrowUpDown,
  AlertCircle
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
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // ALL, AVAILABLE, LIMITED, FULL
  const [parkingTypeFilter, setParkingTypeFilter] = useState('ALL');
  const [evOnly, setEvOnly] = useState(false);
  const [twentyFourSeven, setTwentyFourSeven] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortBy, setSortBy] = useState('RELEVANCE'); // RELEVANCE, PRICE_ASC, PRICE_DESC, AVAILABILITY

  // Fetch from backend
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
      setError('Unable to load parking facilities. Please check your network and try again.');
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

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedCategory('ALL');
    setSelectedVehicleType('ALL');
    setAvailabilityFilter('ALL');
    setParkingTypeFilter('ALL');
    setEvOnly(false);
    setTwentyFourSeven(false);
    setMaxPrice(100);
    setSortBy('RELEVANCE');
    setSearchParams({});
  };

  // Filter & Sort Pipeline
  let processedLots = parkingLots.filter((lot) => {
    // Vehicle type
    if (selectedVehicleType !== 'ALL') {
      const hasType = lot.slots?.some(
        (s) => s.vehicleType === selectedVehicleType && s.active
      );
      if (!hasType && lot.slots && lot.slots.length > 0) return false;
    }

    // Availability filter
    const totalCapacity = lot.totalCapacity || lot.totalSlots || 100;
    const occupied = lot.occupiedSlots || 0;
    const reserved = lot.reservedSlots || 0;
    const free = lot.availableSlots !== undefined ? lot.availableSlots : Math.max(0, totalCapacity - occupied - reserved);

    if (availabilityFilter === 'AVAILABLE' && free <= 0) return false;
    if (availabilityFilter === 'LIMITED' && (free <= 0 || free > Math.max(5, Math.floor(totalCapacity * 0.15)))) return false;
    if (availabilityFilter === 'FULL' && free > 0) return false;

    // Parking Type filter
    if (parkingTypeFilter !== 'ALL') {
      if (!lot.parkingType?.toLowerCase().includes(parkingTypeFilter.toLowerCase())) return false;
    }

    // EV filter
    if (evOnly) {
      const hasEV = lot.hasEVCharging || lot.slots?.some((s) => s.vehicleType === 'EV' && s.active);
      if (!hasEV) return false;
    }

    // 24x7 filter
    if (twentyFourSeven) {
      const is24x7 = lot.openingTime?.toLowerCase().includes('24') || lot.closingTime?.toLowerCase().includes('24');
      if (!is24x7) return false;
    }

    // Price filter
    const startingPrice = lot.startingPrice || 40;
    if (startingPrice > maxPrice) return false;

    return true;
  });

  // Sorting
  if (sortBy === 'PRICE_ASC') {
    processedLots.sort((a, b) => (a.startingPrice || 40) - (b.startingPrice || 40));
  } else if (sortBy === 'PRICE_DESC') {
    processedLots.sort((a, b) => (b.startingPrice || 40) - (a.startingPrice || 40));
  } else if (sortBy === 'AVAILABILITY') {
    processedLots.sort((a, b) => (b.availableSlots || 0) - (a.availableSlots || 0));
  }

  const hasActiveFilters =
    selectedCity !== '' ||
    selectedCategory !== 'ALL' ||
    selectedVehicleType !== 'ALL' ||
    availabilityFilter !== 'ALL' ||
    parkingTypeFilter !== 'ALL' ||
    evOnly ||
    twentyFourSeven ||
    maxPrice < 100 ||
    searchQuery !== '';

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
          Find Parking Near Your Destination
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Search, compare and reserve parking before you arrive.
        </p>
      </div>

      {/* Dedicated Search Panel */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.2fr) minmax(240px, 3fr) auto', gap: '0.75rem' }}>
            {/* City Selector */}
            <div style={{ position: 'relative' }}>
              <MapPin size={17} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--primary)' }} />
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  const newParams = {};
                  if (searchQuery) newParams.search = searchQuery;
                  if (e.target.value) newParams.city = e.target.value;
                  if (selectedCategory !== 'ALL') newParams.category = selectedCategory;
                  setSearchParams(newParams);
                }}
                className="form-input"
                style={{ paddingLeft: '2.4rem', fontWeight: 600, height: '46px' }}
              >
                <option value="">All Indian Cities</option>
                {INDIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Destination Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search for a mall, railway station, hospital, college or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem', height: '46px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '46px', padding: '0 1.6rem', fontWeight: 700, borderRadius: '10px' }}>
              Search
            </button>
          </div>
        </form>

        {/* Quick Category Chips */}
        <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingTop: '1rem', scrollbarWidth: 'none' }}>
          {DESTINATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const newParams = {};
                  if (searchQuery) newParams.search = searchQuery;
                  if (selectedCity) newParams.city = selectedCity;
                  if (cat.id !== 'ALL') newParams.category = cat.id;
                  setSearchParams(newParams);
                }}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  color: isSelected ? 'var(--primary)' : '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Filters Sidebar + Results List */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.75rem', alignItems: 'flex-start' }} className="find-parking-layout">
        
        {/* Left Filters Panel */}
        <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
              <Filter size={16} color="var(--primary)" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Vehicle Type Filter */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
              Vehicle Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
              {['ALL', 'CAR', 'BIKE', 'SUV', 'EV'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedVehicleType(t)}
                  style={{
                    padding: '0.4rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: selectedVehicleType === t ? 700 : 500,
                    border: selectedVehicleType === t ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                    background: selectedVehicleType === t ? '#eff6ff' : '#ffffff',
                    color: selectedVehicleType === t ? 'var(--primary)' : '#475569',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Status Filter */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
              Availability
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { id: 'ALL', label: 'All Statuses' },
                { id: 'AVAILABLE', label: '🟢 Available Bays Only' },
                { id: 'LIMITED', label: '🟡 Limited Capacity' },
              ].map((a) => (
                <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="availFilter"
                    checked={availabilityFilter === a.id}
                    onChange={() => setAvailabilityFilter(a.id)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Facilities & Features */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
              Facilities & Amenities
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={evOnly}
                  onChange={(e) => setEvOnly(e.target.checked)}
                  style={{ accentColor: '#16a34a' }}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Zap size={13} color="#16a34a" /> EV Fast-Charging
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={twentyFourSeven}
                  onChange={(e) => setTwentyFourSeven(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span>Open 24x7 Facilities</span>
              </label>
            </div>
          </div>

          {/* Parking Structure Type */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
              Parking Type
            </label>
            <select
              className="form-input"
              value={parkingTypeFilter}
              onChange={(e) => setParkingTypeFilter(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
            >
              <option value="ALL">All Types</option>
              <option value="Multi-Level">Multi-Level Covered</option>
              <option value="Surface">Surface Bay</option>
              <option value="Basement">Basement Bay</option>
              <option value="Automated">Automated Stack</option>
            </select>
          </div>

          {/* Max Hourly Rate Range */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Max Hourly Tariff
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              <span>₹10</span>
              <span>₹50</span>
              <span>₹100</span>
            </div>
          </div>
        </div>

        {/* Right Results Section */}
        <div>
          {/* Results Action / Sort Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 700 }}>
              Showing <strong style={{ color: 'var(--primary)' }}>{processedLots.length}</strong> parking facilities
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Sort selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b' }}>
                <ArrowUpDown size={14} />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.3rem 0.5rem',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    background: '#ffffff'
                  }}
                >
                  <option value="RELEVANCE">Relevance</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="AVAILABILITY">Most Vacancies</option>
                </select>
              </div>

              {/* Refresh button */}
              <button
                onClick={() => fetchParkingLots(true)}
                disabled={refreshing}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem' }}
                title="Sync live vacancies from backend"
              >
                <RotateCw size={13} className={refreshing ? 'spin' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Availability'}</span>
              </button>
            </div>
          </div>

          {/* Results List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', height: '140px' }}>
                  <SkeletonLoader lines={3} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <AlertCircle size={36} color="#dc2626" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ color: '#0f172a', marginBottom: '0.35rem', fontSize: '1.15rem' }}>Unable to load parking facilities</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>{error}</p>
              <button onClick={() => fetchParkingLots()} className="btn btn-primary btn-sm">
                Retry
              </button>
            </div>
          ) : processedLots.length === 0 ? (
            <EmptyState
              title="No parking facilities found"
              description="Try changing your destination, city, or clearing some filters to see available parking."
              actionText="Clear Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {processedLots.map((lot) => (
                <ParkingLotCard key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .find-parking-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ParkingLotsPage;
