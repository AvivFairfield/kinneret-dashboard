import React, { useState } from 'react';
import './AdvancedFilters.css';

const AdvancedFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    temperatureRange: { min: '', max: '' },
    phRange: { min: '', max: '' },
    chlorophyllRange: { min: '', max: '' },
    station: 'all',
    depth: 'all'
  });

  const handleFilterChange = (category, field, value) => {
    const newFilters = {
      ...filters,
      [category]: field ? { ...filters[category], [field]: value } : value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      temperatureRange: { min: '', max: '' },
      phRange: { min: '', max: '' },
      chlorophyllRange: { min: '', max: '' },
      station: 'all',
      depth: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="advanced-filters">
      <h3>🔍 Advanced Filters</h3>
      
      <div className="filter-grid">
        <div className="filter-group">
          <label>Temperature Range (°C)</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.temperatureRange.min}
              onChange={(e) => handleFilterChange('temperatureRange', 'min', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.temperatureRange.max}
              onChange={(e) => handleFilterChange('temperatureRange', 'max', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>pH Range</label>
          <div className="range-inputs">
            <input
              type="number"
              step="0.1"
              placeholder="Min"
              value={filters.phRange.min}
              onChange={(e) => handleFilterChange('phRange', 'min', e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Max"
              value={filters.phRange.max}
              onChange={(e) => handleFilterChange('phRange', 'max', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Chlorophyll Range (μg/L)</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.chlorophyllRange.min}
              onChange={(e) => handleFilterChange('chlorophyllRange', 'min', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.chlorophyllRange.max}
              onChange={(e) => handleFilterChange('chlorophyllRange', 'max', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Station</label>
          <select
            value={filters.station}
            onChange={(e) => handleFilterChange('station', null, e.target.value)}
          >
            <option value="all">All Stations</option>
            <option value="A">Station A</option>
            <option value="B">Station B</option>
            <option value="C">Station C</option>
          </select>
        </div>
      </div>

      <button onClick={clearFilters} className="clear-filters">
        Clear All Filters
      </button>
    </div>
  );
};

export default AdvancedFilters;