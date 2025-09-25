import React from 'react';
import './DateRangeFilter.css';

const DateRangeFilter = ({ dateRange, onDateRangeChange }) => {
  const handleStartDateChange = (e) => {
    onDateRangeChange({
      ...dateRange,
      start: new Date(e.target.value)
    });
  };

  const handleEndDateChange = (e) => {
    onDateRangeChange({
      ...dateRange,
      end: new Date(e.target.value)
    });
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="date-range-filter">
      <h3>Filter by Date Range</h3>
      <div className="date-inputs">
        <div className="date-input">
          <label>Start Date:</label>
          <input
            type="date"
            value={formatDateForInput(dateRange.start)}
            onChange={handleStartDateChange}
            min="2000-01-01"
            max="2023-12-31"
          />
        </div>
        <div className="date-input">
          <label>End Date:</label>
          <input
            type="date"
            value={formatDateForInput(dateRange.end)}
            onChange={handleEndDateChange}
            min="2000-01-01"
            max="2023-12-31"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;