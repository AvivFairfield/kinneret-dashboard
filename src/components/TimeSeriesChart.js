import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import AIInsights from './AIInsights';
import './ChartWithFilters.css';

const TimeSeriesChart = ({ data }) => {
  const [visibleLines, setVisibleLines] = useState({
    temperature: true,
    ph: true,
    chlorophyll: true,
    dissolved_oxygen: true
  });

  const chartData = data.map(item => ({
    date: format(item.date, 'yyyy-MM'),
    temperature: item.temperature,
    ph: item.ph,
    chlorophyll: item.chlorophyll,
    dissolved_oxygen: item.dissolved_oxygen
  }));

  const toggleLine = (lineKey) => {
    setVisibleLines(prev => ({
      ...prev,
      [lineKey]: !prev[lineKey]
    }));
  };

  return (
    <div className="chart-with-filters">
      <div className="chart-filters">
        <h4>Show Parameters:</h4>
        <div className="filter-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={visibleLines.temperature}
              onChange={() => toggleLine('temperature')}
            />
            Temperature (°C)
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.ph}
              onChange={() => toggleLine('ph')}
            />
            pH
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.chlorophyll}
              onChange={() => toggleLine('chlorophyll')}
            />
            Chlorophyll (μg/L)
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.dissolved_oxygen}
              onChange={() => toggleLine('dissolved_oxygen')}
            />
            Dissolved Oxygen (mg/L)
          </label>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {visibleLines.temperature && (
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#e74c3c" 
              name="Temperature (°C)"
            />
          )}
          {visibleLines.ph && (
            <Line 
              type="monotone" 
              dataKey="ph" 
              stroke="#3498db" 
              name="pH"
            />
          )}
          {visibleLines.chlorophyll && (
            <Line 
              type="monotone" 
              dataKey="chlorophyll" 
              stroke="#2ecc71" 
              name="Chlorophyll (μg/L)"
            />
          )}
          {visibleLines.dissolved_oxygen && (
            <Line 
              type="monotone" 
              dataKey="dissolved_oxygen" 
              stroke="#f39c12" 
              name="Dissolved Oxygen (mg/L)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <AIInsights 
        data={data} 
        chartType="probe" 
        title="Temperature & pH Analysis"
      />
    </div>
  );
};

export default TimeSeriesChart;