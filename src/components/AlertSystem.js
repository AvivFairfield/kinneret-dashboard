import React from 'react';
import './AlertSystem.css';

const AlertSystem = ({ data, dateRange }) => {
  const thresholds = {
    temperature: { min: 10, max: 30 },
    ph: { min: 6.5, max: 8.5 },
    chlorophyll: { max: 50 },
    microcystis: { max: 10000 },
    dissolved_oxygen: { min: 5 }
  };

  const checkAlerts = () => {
    const alerts = [];
    const recentData = data.probeProfiles
      .filter(item => item.date >= dateRange.start && item.date <= dateRange.end)
      .slice(-10); // Last 10 readings

    recentData.forEach(item => {
      if (item.temperature > thresholds.temperature.max) {
        alerts.push({ type: 'danger', message: `High temperature: ${item.temperature}°C`, date: item.date });
      }
      if (item.ph < thresholds.ph.min || item.ph > thresholds.ph.max) {
        alerts.push({ type: 'warning', message: `pH out of range: ${item.ph}`, date: item.date });
      }
      if (item.chlorophyll > thresholds.chlorophyll.max) {
        alerts.push({ type: 'danger', message: `High chlorophyll: ${item.chlorophyll} μg/L`, date: item.date });
      }
      if (item.dissolved_oxygen < thresholds.dissolved_oxygen.min) {
        alerts.push({ type: 'danger', message: `Low oxygen: ${item.dissolved_oxygen} mg/L`, date: item.date });
      }
    });

    return alerts.slice(0, 5); // Show top 5 alerts
  };

  const alerts = checkAlerts();

  return (
    <div className="alert-system">
      <h3>🚨 Environmental Alerts</h3>
      {alerts.length === 0 ? (
        <div className="alert-item safe">
          <span>✅ All parameters within safe ranges</span>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.type}`}>
            <span>{alert.message}</span>
            <small>{alert.date.toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default AlertSystem;