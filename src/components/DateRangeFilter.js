import React, { useState } from "react";
import "./DateRangeFilter.css";

const DateRangeFilter = ({ dateRange, onDateRangeChange }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const isValidDate = (date) => {
		return date instanceof Date && !isNaN(date.getTime());
	};

	const handleStartDateChange = (e) => {
		try {
			const newDate = new Date(e.target.value);
			if (isValidDate(newDate)) {
				onDateRangeChange({
					...dateRange,
					start: newDate,
				});
			}
		} catch (error) {
			console.warn("Invalid start date:", e.target.value);
		}
	};

	const handleEndDateChange = (e) => {
		try {
			const newDate = new Date(e.target.value);
			if (isValidDate(newDate)) {
				onDateRangeChange({
					...dateRange,
					end: newDate,
				});
			}
		} catch (error) {
			console.warn("Invalid end date:", e.target.value);
		}
	};

	const formatDateForInput = (date) => {
		try {
			if (!isValidDate(date)) {
				// Fallback to default dates
				const fallbackDate = new Date("2020-01-01");
				return fallbackDate.toISOString().split("T")[0];
			}
			return date.toISOString().split("T")[0];
		} catch (error) {
			console.warn("Error formatting date:", date);
			return "2020-01-01"; // Safe fallback
		}
	};

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	// Ensure we have valid dates before rendering
	const safeStartDate = isValidDate(dateRange?.start)
		? dateRange.start
		: new Date("2020-01-01");
	const safeEndDate = isValidDate(dateRange?.end)
		? dateRange.end
		: new Date("2023-12-31");

	return (
		<div
			className={`date-range-filter ${
				isExpanded ? "expanded" : "minimized"
			}`}
		>
			{!isExpanded ? (
				<button className="date-filter-toggle" onClick={toggleExpanded}>
					📅
				</button>
			) : (
				<>
					<div className="date-filter-header">
						<h3>Filter by Date Range</h3>
						<button
							className="minimize-btn"
							onClick={toggleExpanded}
						>
							✕
						</button>
					</div>
					<div className="date-inputs">
						<div className="date-input">
							<label>Start Date:</label>
							<input
								type="date"
								value={formatDateForInput(safeStartDate)}
								onChange={handleStartDateChange}
								min="2000-01-01"
								max="2023-12-31"
							/>
						</div>
						<div className="date-input">
							<label>End Date:</label>
							<input
								type="date"
								value={formatDateForInput(safeEndDate)}
								onChange={handleEndDateChange}
								min="2000-01-01"
								max="2023-12-31"
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DateRangeFilter;
