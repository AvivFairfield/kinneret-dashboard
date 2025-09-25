import React from 'react';
import { BarChart, Bar, ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ChartTypeSelector.css';

const ChartTypeSelector = ({ data, chartType, onChartTypeChange, dataKey, title }) => {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#3498db" />
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke="#3498db" fill="#3498db" fillOpacity={0.3} />
          </AreaChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Scatter dataKey={dataKey} fill="#3498db" />
          </ScatterChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="chart-type-selector">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-controls">
          <select value={chartType} onChange={(e) => onChartTypeChange(e.target.value)}>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartTypeSelector;