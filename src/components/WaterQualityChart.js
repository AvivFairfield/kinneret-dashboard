import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import AIInsights from './AIInsights';
import './ChartWithFilters.css';

const WaterQualityChart = ({ data }) => {
  const [visibleLines, setVisibleLines] = useState({
    avg_ph: true,
    avg_turbidity: true,
    avg_cl: true,
    avg_nitrate: true,
    avg_nitrit: true
  });

  const chartData = data.map(item => ({
    date: format(item.date, 'yyyy-MM'),
    avg_ph: item.avg_ph,
    avg_turbidity: item.avg_turbidity,
    avg_cl: item.avg_cl,
    avg_nitrate: item.avg_nitrate,
    avg_nitrit: item.avg_nitrit
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
              checked={visibleLines.avg_ph}
              onChange={() => toggleLine('avg_ph')}
            />
            pH Level
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.avg_turbidity}
              onChange={() => toggleLine('avg_turbidity')}
            />
            Turbidity (NTU)
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.avg_cl}
              onChange={() => toggleLine('avg_cl')}
            />
            Chloride (mg/L)
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.avg_nitrate}
              onChange={() => toggleLine('avg_nitrate')}
            />
            Nitrate (mg/L)
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleLines.avg_nitrit}
              onChange={() => toggleLine('avg_nitrit')}
            />
            Nitrite (mg/L)
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
          {visibleLines.avg_ph && (
            <Line 
              type="monotone" 
              dataKey="avg_ph" 
              stroke="#9b59b6" 
              name="pH Level"
            />
          )}
          {visibleLines.avg_turbidity && (
            <Line 
              type="monotone" 
              dataKey="avg_turbidity" 
              stroke="#e67e22" 
              name="Turbidity (NTU)"
            />
          )}
          {visibleLines.avg_cl && (
            <Line 
              type="monotone" 
              dataKey="avg_cl" 
              stroke="#1abc9c" 
              name="Chloride (mg/L)"
            />
          )}
          {visibleLines.avg_nitrate && (
            <Line 
              type="monotone" 
              dataKey="avg_nitrate" 
              stroke="#e74c3c" 
              name="Nitrate (mg/L)"
            />
          )}
          {visibleLines.avg_nitrit && (
            <Line 
              type="monotone" 
              dataKey="avg_nitrit" 
              stroke="#f39c12" 
              name="Nitrite (mg/L)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <AIInsights 
        data={data} 
        chartType="chemistry" 
        title="Water Chemistry Analysis"
      />
    </div>
  );
};

export default WaterQualityChart;