import React from 'react';
import './DataExport.css';

const DataExport = ({ data, dateRange }) => {
  const exportToCSV = (dataset, filename) => {
    const filteredData = dataset.filter(
      item => item.date >= dateRange.start && item.date <= dateRange.end
    );
    
    if (filteredData.length === 0) {
      alert('No data in selected date range');
      return;
    }

    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => {
          const value = row[header];
          return value instanceof Date ? value.toISOString() : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${dateRange.start.toISOString().split('T')[0]}_to_${dateRange.end.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      },
      data: {
        cyanobacteria: data.cyanobacteria.filter(item => item.date >= dateRange.start && item.date <= dateRange.end),
        chemistry: data.chemistry.filter(item => item.date >= dateRange.start && item.date <= dateRange.end),
        probeProfiles: data.probeProfiles.filter(item => item.date >= dateRange.start && item.date <= dateRange.end)
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kinneret_data_${dateRange.start.toISOString().split('T')[0]}_to_${dateRange.end.toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="data-export">
      <h3>📥 Export Data</h3>
      <div className="export-buttons">
        <button onClick={() => exportToCSV(data.cyanobacteria, 'cyanobacteria')}>
          Export Cyanobacteria CSV
        </button>
        <button onClick={() => exportToCSV(data.chemistry, 'chemistry')}>
          Export Chemistry CSV
        </button>
        <button onClick={() => exportToCSV(data.probeProfiles, 'probe_profiles')}>
          Export Probe Data CSV
        </button>
        <button onClick={exportToJSON} className="json-export">
          Export All Data JSON
        </button>
      </div>
    </div>
  );
};

export default DataExport;