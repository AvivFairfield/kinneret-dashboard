import React, { useState } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import CyanobacteriaChart from "./CyanobacteriaChart";
import WaterQualityChart from "./WaterQualityChart";
import DataSummary from "./DataSummary";
import DateRangeFilter from "./DateRangeFilter";
import AlertSystem from "./AlertSystem";
import DataExport from "./DataExport";
import MapIntegration from "./MapIntegration";
import FileUpload from "./FileUpload";
import FileManager from "./FileManager";
import RAGSearch from "./RAGSearch";
import "./Dashboard.css";

const Dashboard = ({ data, onDataUpdate }) => {
	const [dateRange, setDateRange] = useState({
		start: new Date("2020-01-01"),
		end: new Date("2023-12-31"),
	});
	const [refreshKey, setRefreshKey] = useState(0);

	const filterDataByDate = (dataset) => {
		return dataset.filter(
			(item) => item.date >= dateRange.start && item.date <= dateRange.end
		);
	};

	const handleDataUpload = async (newData, filename, dataType) => {
		// Update dashboard data
		await onDataUpdate();
		// Force FileManager to refresh
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<div className="dashboard">
			{/* Floating Date Range Filter */}
			<div className="floating-date-filter">
				<DateRangeFilter
					dateRange={dateRange}
					onDateRangeChange={setDateRange}
				/>
			</div>

			<div className="dashboard-grid">
				{/* First Row: Upload and Export */}
				<div className="row-1">
					<div className="upload-section">
						<FileUpload onDataUpload={handleDataUpload} />
					</div>
					<div className="export-section">
						<DataExport data={data} dateRange={dateRange} />
					</div>
				</div>

				{/* File Manager gets its own row */}
				<div className="file-manager-row">
					<FileManager key={refreshKey} onDataUpdate={onDataUpdate} />
				</div>

				{/* Data Summary */}
				<div className="row-4">
					<div className="summary-section">
						<DataSummary data={data} dateRange={dateRange} />
					</div>
				</div>

				{/* Third Row: Alerts and Map */}
				<div className="row-3">
					<div className="alert-section">
						<AlertSystem data={data} dateRange={dateRange} />
					</div>
					<div className="map-section">
						<MapIntegration data={data} />
					</div>
				</div>

				{/* Fourth Row: Search */}
				<div className="row-4">
					<div className="search-section">
						<RAGSearch />
					</div>
				</div>

				{/* Chart Rows - Each chart gets its own row */}
				<div className="chart-row">
					<div className="chart-section">
						<h2>Cyanobacteria Levels</h2>
						<CyanobacteriaChart
							dateRange={dateRange}
							data={filterDataByDate(data.cyanobacteria)}
						/>
					</div>
				</div>

				<div className="chart-row">
					<div className="chart-section">
						<h2>Water Quality Parameters</h2>
						<WaterQualityChart
							dateRange={dateRange}
							data={filterDataByDate(data.chemistry)}
						/>
					</div>
				</div>

				<div className="chart-row">
					<div className="chart-section">
						<h2>Probe Profiles</h2>
						<TimeSeriesChart
							dateRange={dateRange}
							data={filterDataByDate(data.probeProfiles)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
