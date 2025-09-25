import React, { useState } from 'react';
import Papa from 'papaparse';
import './FileUpload.css';

const FileUpload = ({ onDataUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('Please select a CSV file');
      return;
    }

    setUploading(true);
    setUploadStatus('Processing file...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const processedData = results.data.map(row => ({
            ...row,
            date: new Date(row.date || row.Date),
            // Convert numeric fields
            ...Object.keys(row).reduce((acc, key) => {
              const value = row[key];
              if (!isNaN(value) && value !== '') {
                acc[key] = parseFloat(value);
              } else {
                acc[key] = value;
              }
              return acc;
            }, {})
          }));

          onDataUpload(processedData, file.name);
          setUploadStatus(`✅ Successfully uploaded ${file.name} (${processedData.length} records)`);
        } catch (error) {
          setUploadStatus(`❌ Error processing file: ${error.message}`);
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        setUploadStatus(`❌ Error reading file: ${error.message}`);
        setUploading(false);
      }
    });
  };

  return (
    <div className="file-upload">
      <h3>📁 Upload New Data</h3>
      <div className="upload-area">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={uploading}
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className={`upload-button ${uploading ? 'uploading' : ''}`}>
          {uploading ? '⏳ Processing...' : '📤 Choose CSV File'}
        </label>
      </div>
      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.includes('❌') ? 'error' : 'success'}`}>
          {uploadStatus}
        </div>
      )}
      <div className="upload-info">
        <p><strong>Supported formats:</strong> CSV files with date column and numeric data</p>
        <p><strong>Expected columns:</strong> date, temperature, ph, chlorophyll, etc.</p>
      </div>
    </div>
  );
};

export default FileUpload;