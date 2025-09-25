import React, { useState } from "react";
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

const PHChart = ({ dateRange, data: chartData }) => {
	const [loading, setLoading] = useState(false);
	const [visibleLines, setVisibleLines] = useState({
		avg_ph: true,
	});

	const toggleLine = (lineKey) => {
		setVisibleLines((prev) => ({
			...prev,
			[lineKey]: !prev[lineKey],
		}));
	};

	if (!chartData || chartData.length === 0)
		return <div>No pH data available</div>;

	const processedChartData = chartData.map((item) => ({
		date: format(item.date, "yyyy-MM"),
		avg_ph: item.avg_ph,
	}));

	return (
		<div className="chart-with-filters">
			<div className="chart-filters">
				<h4>Show Parameters:</h4>
				<div className="filter-checkboxes">
					<label>
						<input
							type="checkbox"
							checked={visibleLines.avg_ph}
							onChange={() => toggleLine("avg_ph")}
						/>
						pH Level
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
					<YAxis domain={[6, 9]} />
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
				</LineChart>
			</ResponsiveContainer>

			<AIInsights
				data={chartData}
				chartType="chemistry"
				title="pH Analysis"
				excludeParameters={[
					"turbidity",
					"chloride",
					"nitrate",
					"nitrite",
				]}
			/>
		</div>
	);
};

export default PHChart;
