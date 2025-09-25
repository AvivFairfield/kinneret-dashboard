import React from 'react';
import './DataSummary.css';

const DataSummary = ({ data, dateRange }) => {
  const calculateStats = (dataset, field) => {
    const values = dataset
      .filter(item => item.date >= dateRange.start && item.date <= dateRange.end)
      .map(item => item[field])
      .filter(val => !isNaN(val) && val !== null);
    
    if (values.length === 0) return { min: 0, max: 0, avg: 0 };
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length
    };
  };

  const tempStats = calculateStats(data.probeProfiles, 'temperature');
  const phStats = calculateStats(data.probeProfiles, 'ph');
  const chlorophyllStats = calculateStats(data.probeProfiles, 'chlorophyll');

  return (
    <div className="data-summary">
      <h2>Data Summary</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Temperature (°C)</h3>
          <div className="stats">
            <span>Min: {tempStats.min.toFixed(1)}</span>
            <span>Max: {tempStats.max.toFixed(1)}</span>
            <span>Avg: {tempStats.avg.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="summary-card">
          <h3>pH Level</h3>
          <div className="stats">
            <span>Min: {phStats.min.toFixed(2)}</span>
            <span>Max: {phStats.max.toFixed(2)}</span>
            <span>Avg: {phStats.avg.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Chlorophyll (μg/L)</h3>
          <div className="stats">
            <span>Min: {chlorophyllStats.min.toFixed(1)}</span>
            <span>Max: {chlorophyllStats.max.toFixed(1)}</span>
            <span>Avg: {chlorophyllStats.avg.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Data Points</h3>
          <div className="stats">
            <span>Chemistry: {data.chemistry.length}</span>
            <span>Probe: {data.probeProfiles.length}</span>
            <span>Cyanobacteria: {data.cyanobacteria.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;