import React, { useState, useEffect } from "react";
import CyanobacteriaDataLoader from "../utils/CyanobacteriaDataLoader";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import AIInsights from "./AIInsights";
import "./ChartWithFilters.css";
const CyanobacteriaChart = ({ dateRange, data: chartData }) => {
	const [loading, setLoading] = useState(false);
	const [visibleLines, setVisibleLines] = useState({
		microcystis_flos_aquae: true,
		cylindrospermopsis_raciborskyi: true,
		aphanizomenon_ovalisporum: true,
	});

	const toggleLine = (lineKey) => {
		setVisibleLines((prev) => ({
			...prev,
			[lineKey]: !prev[lineKey],
		}));
	};

	if (!chartData || chartData.length === 0)
		return <div>No cyanobacteria data available</div>;

	const processedChartData = chartData.map((item) => ({
		date: format(item.date, "yyyy-MM"),
		microcystis_flos_aquae: item.microcystis_flos_aquae,
		cylindrospermopsis_raciborskyi: item.cylindrospermopsis_raciborskyi,
		aphanizomenon_ovalisporum: item.aphanizomenon_ovalisporum,
	}));
	return (
		<div className="chart-with-filters">
			<div className="chart-filters">
				<h4>Show Parameters:</h4>
				<div className="filter-checkboxes">
					<label>
						<input
							type="checkbox"
							checked={visibleLines.microcystis_flos_aquae}
							onChange={() =>
								toggleLine("microcystis_flos_aquae")
							}
						/>
						Microcystis flos-aquae (cells/mL)
					</label>
					<label>
						<input
							type="checkbox"
							checked={
								visibleLines.cylindrospermopsis_raciborskyi
							}
							onChange={() =>
								toggleLine("cylindrospermopsis_raciborskyi")
							}
						/>
						Cylindrospermopsis raciborskyi (cells/mL)
					</label>
					<label>
						<input
							type="checkbox"
							checked={visibleLines.aphanizomenon_ovalisporum}
							onChange={() =>
								toggleLine("aphanizomenon_ovalisporum")
							}
						/>
						Aphanizomenon ovalisporum (cells/mL)
					</label>
				</div>
			</div>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart
					data={processedChartData}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					{visibleLines.microcystis_flos_aquae && (
						<Line
							type="monotone"
							dataKey="microcystis_flos_aquae"
							stroke="#e74c3c"
							name="Microcystis flos-aquae (cells/mL)"
						/>
					)}
					{visibleLines.cylindrospermopsis_raciborskyi && (
						<Line
							type="monotone"
							dataKey="cylindrospermopsis_raciborskyi"
							stroke="#f39c12"
							name="Cylindrospermopsis raciborskyi (cells/mL)"
						/>
					)}
					{visibleLines.aphanizomenon_ovalisporum && (
						<Line
							type="monotone"
							dataKey="aphanizomenon_ovalisporum"
							stroke="#3498db"
							name="Aphanizomenon ovalisporum (cells/mL)"
						/>
					)}
				</LineChart>
			</ResponsiveContainer>
			<AIInsights
				data={chartData}
				chartType="cyanobacteria"
				title="Cyanobacteria Analysis"
			/>
		</div>
	);
};
export default CyanobacteriaChart;
