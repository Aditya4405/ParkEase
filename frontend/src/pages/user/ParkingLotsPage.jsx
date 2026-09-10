import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parkingApi } from '../../api/parkingApi';
import ParkingLotCard from '../../components/parking/ParkingLotCard';
import MapVisualizer from '../../components/parking/MapVisualizer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  Search, 
  MapPin, 
  Filter, 
  RotateCcw, 
  Car, 
  Building2, 
  SlidersHorizontal, 
  Zap, 
  Compass, 
  List, 
  Map as MapIcon, 
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
import { INDIAN_CITIES } from '../../data/indianDestinations';

const ParkingLotsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [city, setCity] = useState(searchParams.get('city') || 'Lucknow');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [sortBy, setSortBy] = useState('FEATURED'); // FEATURED, PRICE_LOW, SLOTS_HIGH
  const [selectedLotOnMap, setSelectedLotOnMap] = useState(null);

  // Mobile View Toggle: 'list' | 'map'
  const [mobileView, setMobileView] = useState('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchLots = async (cityName, searchName) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      const targetCity = cityName !== undefined ? cityName : city;
      const targetSearch = searchName !== undefined ? searchName : search;

      if (targetCity && targetCity !== 'All Cities') params.city = targetCity.trim();
      if (targetSearch.trim()) params.search = targetSearch.trim();

      const res = await parkingApi.searchParkingLots(params);
      setLots(res.data);
      if (res.data.length > 0) {
        setSelectedLotOnMap(res.data[0]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialCity = searchParams.get('city') || 'Lucknow';
    const initialSearch = searchParams.get('search') || '';
    setCity(initialCity);
    setSearch(initialSearch);
    fetchLots(initialCity, initialSearch);
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (city && city !== 'All Cities') newParams.city = city.trim();
    if (search.trim()) newParams.search = search.trim();
    setSearchParams(newParams);
    fetchLots(city, search);
    setMobileFilterOpen(false);
  };

  const handleReset = () => {
    setCity('Lucknow');
    setSearch('');
    setVehicleFilter('ALL');
    setAvailabilityOnly(false);
    setSortBy('FEATURED');
    setSearchParams({ city: 'Lucknow' });
    fetchLots('Lucknow', '');
  };

  // Filter and Sort Processing
  let processedLots = lots.filter((lot) => {
    if (vehicleFilter !== 'ALL') {
      const hasType = lot.slots?.some((s) => s.vehicleType === vehicleFilter && s.active);
      if (!hasType) return false;
    }
    if (availabilityOnly) {
      const freeSlots = lot.slots ? lot.slots.filter((s) => s.isAvailable && s.active).length : (lot.availableSlots || 0);
      if (freeSlots <= 0) return false;
    }
    return true;
  });

  if (sortBy === 'PRICE_LOW') {
    processedLots.sort((a, b) => {
      const priceA = a.startingPrice || (a.slots && a.slots[0]?.price) || 999;
      const priceB = b.startingPrice || (b.slots && b.slots[0]?.price) || 999;
      return priceA - priceB;
    });
  } else if (sortBy === 'SLOTS_HIGH') {
    processedLots.sort((a, b) => {
      const freeA = a.availableSlots || (a.slots ? a.slots.filter((s) => s.isAvailable).length : 0);
      const freeB = b.availableSlots || (b.slots ? b.slots.filter((s) => s.isAvailable).length : 0);
      return freeB - freeA;
    });
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Page Heading & Indian Hub Context */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
              🇮🇳 India Smart Parking Radar
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • {city || 'All Hubs'} Area
            </span>
          </div>
          <h1 className="page-title">
            <Compass size={28} style={{ color: 'var(--primary)' }} />
            Discover Nearby Parking
          </h1>
          <p className="page-subtitle">
            Live slot availability, hourly rates in ₹, and instant guaranteed reservations.
          </p>
        </div>

        {/* Mobile View Toggle Switch */}
        <div className="mobile-toggle" style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setMobileView('list')}
            className={`btn btn-sm ${mobileView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <List size={16} />
            <span>List View</span>
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`btn btn-sm ${mobileView === 'map' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <MapIcon size={16} />
            <span>Radar Map</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleFilterSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1.5fr 1fr 1fr auto auto',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            {/* City Selector */}
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <select
                className="form-select"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                style={{ paddingLeft: '2.2rem' }}
              >
                <option value="All Cities">All Cities (India)</option>
                {INDIAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search place, mall, station or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
            </div>

            {/* Vehicle Type Filter */}
            <div>
              <select
                className="form-select"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <option value="ALL">All Vehicle Types</option>
                <option value="CAR">Car / Sedan / Hatch</option>
                <option value="BIKE">Two-Wheeler / Bike</option>
                <option value="SUV">SUV / Large Bay</option>
                <option value="EV">EV Charging Bay ⚡</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="FEATURED">Sort: Featured</option>
                <option value="PRICE_LOW">Price: Lowest (₹)</option>
                <option value="SLOTS_HIGH">Availability: Most Slots</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Search size={16} />
              <span>Filter</span>
            </button>

            {/* Reset Button */}
            <button type="button" onClick={handleReset} className="btn btn-secondary" title="Reset all filters">
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Quick Filter Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 600, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Show Available Slots Only</span>
            </label>

            <span style={{ color: 'var(--border)' }}>|</span>

            {/* Quick City shortcuts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick Hubs:</span>
              {['Lucknow', 'Noida', 'Delhi', 'Ayodhya', 'Kanpur'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCity(c);
                    fetchLots(c, search);
                  }}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    background: city === c ? 'var(--primary-light)' : '#f1f5f9',
                    color: city === c ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: city === c ? 700 : 500,
                    border: '1px solid',
                    borderColor: city === c ? '#c7d2fe' : 'transparent',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Results Header Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Showing <strong>{processedLots.length}</strong> smart parking facilities in <strong>{city || 'India'}</strong>
        </p>

        {processedLots.length > 0 && (
          <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
            <CheckCircle2 size={12} /> Live Inventory Connected
          </span>
        )}
      </div>

      {/* Split View Layout (Desktop: Left List + Right Sticky Map) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mobileView === 'map' ? '1fr' : '1.2fr 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Results List */}
        <div style={{ display: mobileView === 'map' ? 'none' : 'block' }}>
          {loading ? (
            <SkeletonLoader count={4} />
          ) : processedLots.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {processedLots.map((lot) => (
                <div
                  key={lot.id}
                  onClick={() => setSelectedLotOnMap(lot)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-lg)',
                    outline: selectedLotOnMap && selectedLotOnMap.id === lot.id ? '2px solid var(--primary)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ParkingLotCard lot={lot} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Parking Lots Found"
              description={`We couldn't find any parking facilities matching your criteria in ${city}. Try resetting filters or choosing another city.`}
              actionText="Reset Filters & Show Lucknow"
              onAction={handleReset}
            />
          )}
        </div>

        {/* Right Column: Sticky Map Radar */}
        <div
          style={{
            position: 'sticky',
            top: '90px',
            display: mobileView === 'list' && window.innerWidth <= 768 ? 'none' : 'block',
            height: 'calc(100vh - 120px)',
            minHeight: '520px',
          }}
        >
          <MapVisualizer
            parkingLots={processedLots}
            selectedLot={selectedLotOnMap}
            onSelectLot={(lot) => setSelectedLotOnMap(lot)}
            city={city || 'Lucknow'}
          />
        </div>
      </div>
    </div>
  );
};

export default ParkingLotsPage;
